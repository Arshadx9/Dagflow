import prisma from "../../shared/utils/Prisma";
export const createworkflow = async (wfname, ownerId) => {
    return await prisma.workflowMain.create({
        data: {
            name: wfname,
            creatorId: ownerId
        }
    });
};
export const createWorkflowversion = async (vnumber, wfid, steps) => {
    return await prisma.workflowVersion.create({
        data: {
            versionNumber: vnumber,
            wfmid: wfid,
            steps: steps
        }
    });
};
export const getworkflowbyowner = async (ownerId) => {
    return await prisma.workflowMain.findMany({
        where: {
            creatorId: ownerId
        }
    });
};
export const getworkflowbyid = async (wfid) => {
    return await prisma.workflowMain.findFirst({
        where: {
            wid: wfid
        },
        include: { wfv: true }
    });
};
export const getlatestversion = async (wfid) => {
    return await prisma.workflowVersion.findFirst({
        where: { wfmid: wfid },
        orderBy: { versionNumber: 'desc' }
    });
};
export const updatewfbyname = async (wfid, newname) => {
    return await prisma.workflowMain.update({
        where: { wid: wfid },
        data: { name: newname }
    });
};
export const deleteworkflow = async (wfid) => {
    return await prisma.workflowMain.delete({
        where: { wid: wfid }
    });
};
