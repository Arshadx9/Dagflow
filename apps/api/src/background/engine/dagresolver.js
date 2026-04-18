import { Status } from "@prisma/client";
import prisma from "../../shared/utils/Prisma";
import { pushtoqueue } from "../queue/producer";
import { JobRunStatus, Jobrunendtime } from "./statemanager";
export const dagresolve = async (versionid, jobrunid, workflowid) => {
    const version = await prisma.workflowVersion.findFirst({
        where: {
            versionid: versionid,
        },
    });
    if (!version) {
        return;
    }
    const steps = version?.steps;
    const stepRuns = await prisma.stepRun.findMany({
        where: {
            jobid: jobrunid,
        },
    });
    for (const step of steps) {
        const matchingStepRun = stepRuns.find((sr) => sr.stepid === step.id);
        if (matchingStepRun?.status === Status.PENDING) {
            const allDepsFinished = step.dependsOn.every((depId) => {
                const depStepRun = stepRuns.find((sr) => sr.stepid === depId);
                return depStepRun?.status === Status.FINISHED;
            });
            if (allDepsFinished) {
                await pushtoqueue({
                    jobRunId: jobrunid,
                    stepRunId: matchingStepRun.steprunid,
                    stepId: step.id,
                    stepConfig: step.config,
                    workflowId: workflowid,
                    versionId: versionid,
                });
            }
        }
    }
    const allStepsFinished = stepRuns.every((sr) => sr.status === Status.FINISHED);
    if (allStepsFinished) {
        await JobRunStatus(jobrunid, Status.FINISHED);
        await Jobrunendtime(jobrunid);
    }
};
