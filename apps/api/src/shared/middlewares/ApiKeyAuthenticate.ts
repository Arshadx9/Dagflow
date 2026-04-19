import { NextFunction, Request, Response } from "express"
import Apperror from "../utils/Apperror"
import { findapibyapi } from "../../services/auth/authrepository"

const apikeyauthenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authheader = req.headers.authorization

        if (!authheader || !authheader.startsWith("Bearer ")) {
            throw new Apperror(401, "no token provided")
        }

        const apikey = authheader.split(" ")[1]

        const foundkey = await findapibyapi(apikey)

        if (!foundkey) {
            throw new Apperror(401, "Invalid API key")
        }

        req.userID = foundkey.bizid

        next()
    } catch (error) {
        next(error)
    }
}

export default apikeyauthenticate