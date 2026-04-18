import z from "zod";
export const registerschema = z.object({
    username: z.string().min(3, "Username must be atleast 3 characters"),
    password: z.string().min(6, "password must be atleast 6 characters")
});
export const loginSchema = z.object({
    username: z.string().min(1, "username is needed"),
    password: z.string().min(1, "password is required")
});
