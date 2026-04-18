import { Router } from "express";
import authenticate from "../../shared/middlewares/Authenticate";
import { createScheduleController, deletescheduleController, getScheduleController, pausecontroller, resumecontroller } from "./schedulecontroller";
import ZodValidate from "../../shared/middlewares/zodvalidate";
import { scheduleschema } from "./scheduleschema";

const schedulerouter = Router()

schedulerouter.post("/createschedule", authenticate,ZodValidate(scheduleschema), createScheduleController)
schedulerouter.get("/getschedules" , authenticate , getScheduleController)
schedulerouter.delete("/:id/deleteschedule" , authenticate , deletescheduleController)
schedulerouter.put("/:id/pause" , authenticate , pausecontroller)
schedulerouter.put("/:id/resume" , authenticate , resumecontroller)

export default schedulerouter