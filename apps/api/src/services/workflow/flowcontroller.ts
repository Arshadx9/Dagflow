import { NextFunction , Request , Response } from "express"
import { thecreateWorkflow , thegetwfbyowner , thegetwfbyid ,theupdate , thedelete } from "./flowservice"
import Apperror from "../../shared/utils/Apperror"
import Responseformatter from "../../shared/utils/Responseformatter"

export const createwfcontroller = async (req : Request , res : Response , next: NextFunction) => {

try{
const {name , steps} = req.body
const ownerId = req.userID 

if(!ownerId){
    throw new Apperror(404 , "ownerID not provided")
}

await thecreateWorkflow(name , ownerId , steps)

res.status(200).json(
    Responseformatter.success("Workflow created" , {
        workflowname : name, 
    })
)

} catch(error){
    next(error)
}

} 

export const getwfcontroller = async (req : Request , res : Response , next: NextFunction)=>{
    try{
       const ownerId = req.userID as string

       if(!ownerId){
    throw new Apperror(404 , "ownerID not provided")
}

     const wf =  await thegetwfbyowner (ownerId)

       res.status(200).json(
        Responseformatter.success("here are your workflows" , {
      workflows : wf
        })
       )
    } catch(error)
    {
        next(error)
    } 

}

export const getwfbyidcontroller = async(req : Request , res : Response , next: NextFunction ) => {

try{
    const id = req.params.id as string

  const wfbid=   await thegetwfbyid(id)

    res.status(200).json(
        Responseformatter.success("here is your  workflow" , {
      workflows : wfbid
        })
       )

}catch(error)
    {
        next(error)
    } 


} 

export const updatecontroller = async (req : Request , res : Response , next: NextFunction) => {

    try{

        const id = req.params.id as string 
const {newname , newsteps} = req.body 

const updtname = await theupdate(id, newname, newsteps)

 res.status(200).json(
        Responseformatter.success("here is your new workflow" , {
      workflows : updtname.workflow
        })
       )

    } catch (error)
    {
        next(error)
    }

} 

export const deletecontroller = async (req : Request , res : Response , next: NextFunction ) => {
    try{
        const id = req.params.id as string

await thedelete(id) 

 res.status(200).json(
        Responseformatter.success("workflow deleted" , {
        })
       )


    } catch(error){
        next(error)
    }
}