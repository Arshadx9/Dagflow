import { Router } from "express";
import authenticate from "../../shared/middlewares/Authenticate";
import { createwfcontroller , getwfcontroller , getwfbyidcontroller , updatecontroller ,deletecontroller } from "./flowcontroller";
import { updateschema, workflowschema } from "./flowschema";
import ZodValidate from "../../shared/middlewares/zodvalidate";


const flowrouter=  Router()

flowrouter.post("/createworkflow" , authenticate ,ZodValidate(workflowschema) ,createwfcontroller )
flowrouter.get("/getworkflow" , authenticate , getwfcontroller)
flowrouter.get("/getworkflowbyid/:id" , authenticate , getwfbyidcontroller)
flowrouter.put("/updatewf/:id" , authenticate, ZodValidate(updateschema) ,  updatecontroller )
flowrouter.delete("/deletewf/:id" , authenticate ,  deletecontroller )

export default flowrouter