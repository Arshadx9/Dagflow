import { NextFunction , Response , Request } from "express";
import Apperror from "../utils/Apperror";


const Errorhandler = (err : Error ,  req : Request ,res : Response  , next : NextFunction) => {

if(err instanceof Apperror){
  var message = err.message
  var statuscode = err.statuscode

  res.status(statuscode).json(
    Responseformatter.error(message)
)
}
else {
    res.status(500).json(
     Responseformatter.error("there was an error")
    )
}

}