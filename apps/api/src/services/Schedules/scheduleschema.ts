import z from "zod";

export const scheduleschema = z.object({
    workflowid : z.string().min(1 , "Workflow id is required"),
    cron : z.string().min(1 , "Cron expression is required")
})