import Apperror from "../../shared/utils/Apperror";
import { createschedule, deleteschedulerepo, getschedulebyowner, updateschedule } from "./schedulerepo";
import { ScheduleStatus } from "@prisma/client";
export const createSchedule = async (workflowId, cron) => {
    let nextRunAt;
    try {
        const cronParser = require("cron-parser");
        const interval = cronParser.parseExpression(cron);
        nextRunAt = interval.next().toDate();
    }
    catch (error) {
        throw new Apperror(400, "Invalid cron expression");
    }
    return await createschedule(workflowId, cron, nextRunAt);
};
export const getschedule = async (ownerid) => {
    const schedule = await getschedulebyowner(ownerid);
    return schedule;
};
export const deleteschedule = async (scheduleid) => {
    await deleteschedulerepo(scheduleid);
};
export const pauseschedule = async (scheduleid) => {
    await updateschedule(scheduleid, ScheduleStatus.PAUSED);
};
export const resumeschedule = async (scheduleid) => {
    await updateschedule(scheduleid, ScheduleStatus.ACTIVE);
};
