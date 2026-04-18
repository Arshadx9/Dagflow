
import { Router } from "express";
import ZodValidate from "../../shared/middlewares/zodvalidate";
import { loginSchema, registerschema } from "./authschema";
import { logincontrol, onboardingcontrol, registrationcontrol } from "./authcontroller";
import authenticate from "../../shared/middlewares/Authenticate";


const authrouter = Router()

authrouter.post("/register" , ZodValidate(registerschema), registrationcontrol )
authrouter.post("/login", ZodValidate(loginSchema) , logincontrol )
authrouter.post("/onboarding" , authenticate , onboardingcontrol)

export default authrouter 