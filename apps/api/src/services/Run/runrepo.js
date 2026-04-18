import { Status } from "@prisma/client";
import prisma from "../../shared/utils/Prisma";
export const createjobrun = async (wfid, vid, input, status) => {
    return await prisma.jobRun.create({
        data: {
            workflowid: wfid,
            versionid: vid,
            data: input,
            status: "PENDING"
        }
    });
};
export const createsteprun = async (jid, stid) => {
    return await prisma.stepRun.create({
        data: {
            jobid: jid,
            stepid: stid,
            status: Status.PENDING,
            retries: 0
        }
    });
};
export const getrunbywfid = async (wfid) => {
    return await prisma.jobRun.findMany({
        where: {
            workflowid: wfid
        }
    });
};
export const getrunbyid = async (runid) => {
    return await prisma.jobRun.findFirst({
        where: {
            jobid: runid
        },
        include: {
            steprun: true
        }
    });
};
export const updatejobrunstatus = async (status, jid) => {
    return await prisma.jobRun.update({
        where: { jobid: jid },
        data: { status: status }
    });
};
export const updatesteprunstatus = async (status, stid) => {
    return await prisma.stepRun.update({
        where: { steprunid: stid },
        data: {
            status: status
        }
    });
};
export const getsteprunbyjobrun = async (jid) => {
    return await prisma.stepRun.findMany({
        where: {
            jobid: jid
        }
    });
};
