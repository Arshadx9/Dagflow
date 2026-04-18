import { thecreateWorkflow, thegetwfbyowner, thegetwfbyid, theupdate, thedelete } from "./flowservice";
import Apperror from "../../shared/utils/Apperror";
import Responseformatter from "../../shared/utils/Responseformatter";
export const createwfcontroller = async (req, res, next) => {
    try {
        const { wfname, steps } = req.body;
        const ownerId = req.userID;
        if (!ownerId) {
            throw new Apperror(404, "ownerID not provided");
        }
        await thecreateWorkflow(wfname, ownerId, steps);
        res.status(200).json(Responseformatter.success("Workflow creatd", {
            workflowname: wfname,
        }));
    }
    catch (error) {
        next(error);
    }
};
export const getwfcontroller = async (req, res, next) => {
    try {
        const ownerId = req.userID;
        if (!ownerId) {
            throw new Apperror(404, "ownerID not provided");
        }
        const wf = await thegetwfbyowner(ownerId);
        res.status(200).json(Responseformatter.success("here are your workflows", {
            workflows: wf
        }));
    }
    catch (error) {
        next(error);
    }
};
export const getwfbyidcontroller = async (req, res, next) => {
    try {
        const id = req.params.id;
        const wfbid = await thegetwfbyid(id);
        res.status(200).json(Responseformatter.success("here is your  workflow", {
            workflows: wfbid
        }));
    }
    catch (error) {
        next(error);
    }
};
export const updatecontroller = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { newname, newsteps } = req.body;
        const updtname = await theupdate(id, newname, newsteps);
        res.status(200).json(Responseformatter.success("here is your new workflow", {
            workflows: updtname.workflow
        }));
    }
    catch (error) {
        next(error);
    }
};
export const deletecontroller = async (req, res, next) => {
    try {
        const id = req.params.id;
        await thedelete(id);
        res.status(200).json(Responseformatter.success("workflow deleted", {}));
    }
    catch (error) {
        next(error);
    }
};
