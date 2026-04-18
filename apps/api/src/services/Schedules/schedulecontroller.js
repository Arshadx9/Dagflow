import { createSchedule, deleteschedule, getschedule, pauseschedule, resumeschedule } from "./scheduleservice";
import Apperror from "../../shared/utils/Apperror";
import Responseformatter from "../../shared/utils/Responseformatter";
export const createScheduleController = async (req, res, next) => {
    try {
        const { workflowid, cron } = req.body;
        const scheduleinfo = await createSchedule(workflowid, cron);
        res.status(201).json(Responseformatter.success("schedule created", scheduleinfo));
    }
    catch (error) {
        next(error);
    }
};
export const getScheduleController = async (req, res, next) => {
    try {
        const ownerId = req.userID;
        if (!ownerId) {
            throw new Apperror(404, "ownerid not found");
        }
        const yourschedule = await getschedule(ownerId);
        res.status(200).json(Responseformatter.success("here is your schedule", yourschedule));
    }
    catch (error) {
        next(error);
    }
};
export const deletescheduleController = async (req, res, next) => {
    try {
        const scheduleid = req.params.id;
        await deleteschedule(scheduleid);
        res.status(200).json(Responseformatter.success("deleted"));
    }
    catch (error) {
        next(error);
    }
};
export const pausecontroller = async (req, res, next) => {
    try {
        const scheduleid = req.params.id;
        await pauseschedule(scheduleid);
        res.status(200).json(Responseformatter.success("paused"));
    }
    catch (error) {
        next(error);
    }
};
export const resumecontroller = async (req, res, next) => {
    try {
        const scheduleid = req.params.id;
        await resumeschedule(scheduleid);
        res.status(200).json(Responseformatter.success("resumed"));
    }
    catch (error) {
        next(error);
    }
};
