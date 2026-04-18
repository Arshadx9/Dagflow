import prisma from "../../shared/utils/Prisma";
export const createschedule = async (worflwid, cron, nextRunAt) => {
    return await prisma.schedule.create({
        data: {
            workflowid: worflwid,
            cron: cron,
            nextRunAt: nextRunAt
        }
    });
};
export const getschedulebyowner = async (ownerid) => {
    return await prisma.schedule.findMany({
        where: {
            wf: {
                creatorId: ownerid
            }
        }
    });
};
export const deleteschedulerepo = async (scheduleId) => {
    await prisma.schedule.delete({
        where: {
            scheduleid: scheduleId
        }
    });
};
export const updateschedule = async (scheduleid, schedulestatus) => {
    await prisma.schedule.update({
        where: {
            scheduleid: scheduleid
        },
        data: {
            schedulestatus: schedulestatus
        }
    });
};
