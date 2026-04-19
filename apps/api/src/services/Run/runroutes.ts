import { Router } from "express";
import authenticate from "../../shared/middlewares/Authenticate";
import { triggerruncontroller , getrunscontroller , getrunbyidcontroller , cancelruncontroller ,retryruncontroller } from "./runcontroller";
import apikeyauthenticate from "../../shared/middlewares/ApiKeyAuthenticate";

const runrouter = Router()

runrouter.post("/:id/trigger" , authenticate , triggerruncontroller)
runrouter.get("/:id/getallrunsforthisworkflow" , authenticate ,getrunscontroller)
runrouter.get("/:id/getspecificrun" , authenticate , getrunbyidcontroller)
runrouter.post("/:id/cancelrun" , authenticate , cancelruncontroller)
runrouter.post("/:id/retryrun" , authenticate , retryruncontroller )
runrouter.post("/:id/trigger", apikeyauthenticate, triggerruncontroller)


export default runrouter 

