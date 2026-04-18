import { Status } from "@prisma/client";
import prisma from "../../shared/utils/Prisma";
export const UpdateStepRunStatus = async (steprunid, status) => {
    return await prisma.stepRun.update({
        where: {
            steprunid: steprunid,
        },
        data: {
            status: status,
        },
    });
};
export const UpdateStepRunOutput = async (steprunid, output) => {
    return await prisma.stepRun.update({
        where: {
            steprunid: steprunid,
        },
        data: {
            output: output,
            status: Status.FINISHED,
            endtime: new Date(),
        },
    });
};
export const UpdateStepError = async (steprunid, message) => {
    return await prisma.stepRun.update({
        where: {
            steprunid: steprunid,
        },
        data: {
            error: message,
            endtime: new Date(),
        },
    });
};
export const JobRunStatus = async (jobrunid, status) => {
    return await prisma.jobRun.update({
        where: {
            jobid: jobrunid,
        },
        data: {
            status: status,
        },
    });
};
export const Jobrunendtime = async (jobrunid) => {
    return await prisma.jobRun.update({
        where: {
            jobid: jobrunid,
        },
        data: {
            endtime: new Date(),
        },
    });
};
