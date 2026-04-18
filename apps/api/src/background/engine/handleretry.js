import { Status } from "@prisma/client";
import { defaultjobs } from "../queue/queueconfig";
import { pushtoqueue } from "../queue/producer";
import { Jobrunendtime, JobRunStatus, UpdateStepRunStatus } from "./statemanager";
export const handleretry = async (currenRetries, jobdata) => {
    let maxRetries = defaultjobs.attempts;
    if (currenRetries < maxRetries) {
        await pushtoqueue(jobdata);
        return;
    }
    else {
        await UpdateStepRunStatus(jobdata.stepRunId, Status.FAILED);
        await JobRunStatus(jobdata.jobRunId, Status.FAILED);
        await Jobrunendtime(jobdata.jobRunId);
    }
};
