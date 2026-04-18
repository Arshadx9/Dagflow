
import { dfs } from "../../shared/utils/Dagvalidator"
import { createworkflow , createWorkflowversion , getworkflowbyowner, getworkflowbyid , getlatestversion , updatewfbyname , deleteworkflow } from "./flowrepo"
import Apperror from "../../shared/utils/Apperror"



export const thecreateWorkflow = async (name: string, ownerId: string, steps: any[]) => {

const graph : any = {} 

steps.forEach((step)=>{
    graph[step.id] =step.dependsOn || []
})

const visited : any = {}

steps.forEach((step)=>{
    dfs(graph, step.id, visited)
})

const identity = await createworkflow(name , ownerId)

const version = await createWorkflowversion(1, identity.wid , steps)

return {
    theidentity : identity ,
    theversion : version
}

}


export const thegetwfbyowner = async (ownerId : string) => {
   
    const wf = await getworkflowbyowner(ownerId) 

    return wf

}

export const thegetwfbyid =async (wfid : string) => {


    const wfbid =await getworkflowbyid (wfid)

     return wfbid 
}


export const theupdate = async (wfid : string , newname : string , newsteps : any[] ) => {


    const graph : any ={}


    newsteps.forEach((newstep)=> {
        graph[newstep.id] = newstep.dependsOn || []
    })



    const visited = {}

    newsteps.forEach((newstep)=> {
        dfs(graph ,newstep.id, visited  )
    })

    const thelatestversion =await  getlatestversion(wfid)

    if(!thelatestversion){
        throw new Apperror(404 , "version doesn't exist")
    }


    const newwfv = await createWorkflowversion(thelatestversion.versionNumber+1 ,wfid , newsteps , )

    const updtname = await updatewfbyname(wfid , newname )

    return{
       workflow:  updtname,
        version : newwfv,
     
    }

}

export const thedelete = async (wfid : string) => {

       const wf = await getworkflowbyid(wfid)

    if(!wf) {
        throw new Apperror(404, "Workflow not found")
    }

    await deleteworkflow(wfid)

}




