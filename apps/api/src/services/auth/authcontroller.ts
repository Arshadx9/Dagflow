import { NextFunction, Request ,Response } from "express";
import { authlogin, authregister , onboarding } from "./authservice";
import config from "../../shared/config";
import Responseformatter from "../../shared/utils/Responseformatter";
import Apperror from "../../shared/utils/Apperror";



export const registrationcontrol = async (req : Request , res : Response , next : NextFunction) => {


try{
    const{username , password} = req.body
    const result = await authregister(username , password)

    res.cookie("token" , result.token, {
    httpOnly : true ,
    maxAge : config.cookie.expiresIn,
    secure :config.cookie.secure,
    
  sameSite: "none"

    })

    res.status(201).json(
        Responseformatter.success("registered successfully ",{
       apikey : result.api
        } )
    )
}
catch(error){
    next(error)
}

}

export const logincontrol = async (req : Request , res : Response ,next : NextFunction) => {


    try{
        const {username , password} = req.body

        const result = await authlogin(username , password)


    res.cookie("token" , result.token, {
    httpOnly : true ,
    maxAge : config.cookie.expiresIn,
    secure :config.cookie.secure,
     sameSite: "none"
    })

      res.status(200).json(
          Responseformatter.success("logged in successfully",{
       user : result.user
        } )
    )

    } catch (error){
        next(error)
    }



}

export const onboardingcontrol = async (req : Request , res : Response ,next : NextFunction) => {
    try{
        if(!req.userID) throw new Apperror(401 , "Unauthorized")
        

        const result =     await  onboarding(req.userID)

            res.status(200).json(Responseformatter.success("Onboarding complete" , result?.theapikey))
} catch(error){
    next(error)
}
} 