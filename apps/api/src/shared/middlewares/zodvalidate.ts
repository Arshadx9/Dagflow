import { NextFunction , Request , Response} from "express"
import z from "zod"
import Apperror from "../utils/Apperror"

const ZodValidate = (schema : z.ZodSchema) =>{

    return (req : Request , res : Response , next : NextFunction)=>{
        const result = schema.safeParse(req.body)

  if(!result.success){
        const message = result.error.issues[0]?.message??"Validation error"
        throw new Apperror(400 ,message)
  }

next()
    }
      

}

export default ZodValidate