import Apperror from "../../shared/utils/Apperror"
import { createschedule , deleteschedulerepo, getschedulebyowner, updateschedule } from "./schedulerepo"
import { ScheduleStatus } from "@prisma/client"

export const createSchedule = async (workflowId: string, cron: string) => {
    
    let nextRunAt: Date

    try {
        const cronParser = require("cron-parser")
        const interval = cronParser.parseExpression(cron)
        nextRunAt = interval.next().toDate()
    } catch(error) {
        throw new Apperror(400, "Invalid cron expression")
    }

    return await createschedule(workflowId, cron, nextRunAt!)
}

export const getschedule = async (ownerid : string) => {
    const schedule = await getschedulebyowner(ownerid)

    return schedule
}

export const deleteschedule = async (scheduleid : string) => {
    await deleteschedulerepo(scheduleid)
}

export const pauseschedule = async (scheduleid : string ) => {
    await updateschedule(scheduleid , ScheduleStatus.PAUSED)
}

export const resumeschedule = async (scheduleid : string ) => {
    await updateschedule(scheduleid , ScheduleStatus.ACTIVE)
}