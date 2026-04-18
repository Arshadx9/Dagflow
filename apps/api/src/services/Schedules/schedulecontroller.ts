import { NextFunction , Request ,Response } from "express";
import { createSchedule, deleteschedule, getschedule, pauseschedule, resumeschedule } from "./scheduleservice";
import Apperror from "../../shared/utils/Apperror";
import Responseformatter from "../../shared/utils/Responseformatter";

export const createScheduleController = async (req : Request , res : Response , next : NextFunction) => {

try{
    const {workflowid , cron}  = req.body

    const scheduleinfo = await createSchedule(workflowid , cron)

    res.status(201).json(Responseformatter.success("schedule created" , scheduleinfo))

}catch(error){
    next(error)
}

}

export const getScheduleController = async (req : Request , res : Response , next : NextFunction) => {
    try{
        const ownerId = req.userID
        if(!ownerId){
            throw new Apperror(404, "ownerid not found")
        }
        const yourschedule = await getschedule(ownerId)

        res.status(200).json(Responseformatter.success("here is your schedule" , yourschedule))
    }catch(error){
        next(error)
    }
}

export const deletescheduleController = async(req : Request , res : Response , next : NextFunction) => {
    try{
        const scheduleid = req.params.id as string
       
        await deleteschedule(scheduleid)
        res.status(200).json(Responseformatter.success("deleted"))
    }catch(error){
        next(error)
    }
}

export const pausecontroller = async (req : Request , res : Response , next : NextFunction) => {
    try{
        const scheduleid = req.params.id as string

        await pauseschedule(scheduleid)
                res.status(200).json(Responseformatter.success("paused"))

    }catch(error){
        next(error)
    }
}

export const resumecontroller = async (req : Request , res : Response , next : NextFunction) => {
    try{
        const scheduleid = req.params.id as string

        await resumeschedule(scheduleid)
                res.status(200).json(Responseformatter.success("resumed"))

    }catch(error){
        next(error)
    }
}


