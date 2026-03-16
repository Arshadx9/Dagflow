import { NextFunction , Request , Response } from "express"
import Apperror from "../utils/Apperror"
import Securityutil from "../utils/Security"

declare global {
    namespace Express {
        interface Request{
            userID? : string
        }
    }
}

const authenticate = (req : Request , res : Response , next : NextFunction) => {
    
    const token  = req.cookies.token 

    if(!token){
        throw new Apperror(401 , "no token provided")
    }

    try{
        const decodedtoken = Securityutil.verifyToken(token) as {userID : string}

        req.userID = decodedtoken.userID

        next()

    } catch (error){
        throw new Apperror(401 , "Invalid or expired token")
    }

}

export default authenticate