import { triggerrun, getruns, getrun, cancelrun, retryrun } from "./runservice";
import Responseformatter from "../../shared/utils/Responseformatter";
export const triggerruncontroller = async (req, res, next) => {
    try {
        const wfid = req.params.id;
        const input = req.body.input;
        const result = await triggerrun(wfid, input);
        res.status(201).json(Responseformatter.success("triggered", result));
    }
    catch (error) {
        next(error);
    }
};
export const getrunscontroller = async (req, res, next) => {
    try {
        const wfid = req.params.id;
        const result = await getruns(wfid);
        res.status(200).json(Responseformatter.success("your runs", result));
    }
    catch (error) {
        next(error);
    }
};
export const getrunbyidcontroller = async (req, res, next) => {
    try {
        const runid = req.params.id;
        const result = await getrun(runid);
        res.status(200).json(Responseformatter.success("your run by id", result));
    }
    catch (error) {
        next(error);
    }
};
export const cancelruncontroller = async (req, res, next) => {
    try {
        const runid = req.params.id;
        const result = await cancelrun(runid);
        res.status(200).json(Responseformatter.success("successfully canceled", result));
    }
    catch (error) {
        next(error);
    }
};
export const retryruncontroller = async (req, res, next) => {
    try {
        const runid = req.params.id;
        const result = await retryrun(runid);
        res.status(200).json(Responseformatter.success("retry done", result));
    }
    catch (error) {
        next(error);
    }
};
