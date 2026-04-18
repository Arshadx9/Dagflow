import z from "zod";
export const workflowschema = z.object({
    name: z.string().min(1, "name must have atleat 1 character"),
    steps: z.array(z.object({
        id: z.string(),
        name: z.string(),
        dependsOn: z.array(z.string())
    }))
});
export const updateschema = z.object({
    newname: z.string().optional(),
    newsteps: z.array(z.object({
        id: z.string(),
        name: z.string(),
        dependsOn: z.array(z.string())
    }))
});
