
import Apperror from "../../shared/utils/Apperror"
import { getlatestversion, getworkflowbyid } from "../workflow/flowrepo"
import { createjobrun, createsteprun ,getrunbyid,getrunbywfid , updatejobrunstatus ,getsteprunbyjobrun , updatesteprunstatus} from "./runrepo"
import { Queue } from "bullmq"
import redisConnection from "../../shared/config/redis"
import { Status } from "@prisma/client"

export const triggerrun = async (wfid : string , input : any ) => {


    const wf = await getworkflowbyid(wfid) 

    if(!wf?.wid){
        throw new Apperror(404 , "no id present")
    }

    const version  = await getlatestversion(wfid)

    if(!version) {
        throw new Apperror(404, "version doesn't exist")
    }

    if(!version?.versionid){
        throw new Apperror(404 , "no versionid present") 
    }

    const thejobrun = await createjobrun(wfid , version.versionid , input , Status.PENDING )

const steps = version.steps as any[]

const steprunmap : any = {}

   for(const step of steps){
     const stepRun = await  createsteprun(thejobrun.jobid , step.id)
     steprunmap[step.id] = stepRun.steprunid
   }

const unblockedSteps = steps.filter(step => step.dependsOn.length === 0)


const stepQueue = new Queue("step-execution" , {connection: redisConnection})




 for(const step of unblockedSteps){
  
   await  stepQueue.add("execute-step" , {
       jobRunId: thejobrun.jobid,
    stepId: step.id,
    stepConfig: step.config,
    stepRunId: steprunmap[step.id],
    workflowId : wfid,
    versionId : version.versionid

    })
    
 }

 return {
    jobRun: thejobrun,
    message: "Run triggered successfully"
}
}

export const getruns = async (wfid : string) => {

const runs = await getrunbywfid (wfid) 

return runs 

}

export const getrun = async (runid: string) => {

    const run = await getrunbyid(runid)

    if(!run){
        throw new Apperror(404 , "run not found")
    }

    return run 

}

export const cancelrun = async(runid : string) => { 

    const runone = await getrunbyid(runid)
if(!runone){
        throw new Apperror(404 , "run not found")
    }

if(runone.status === Status.FINISHED){
      throw new Apperror(404 , "run finished")
}


const update = await  updatejobrunstatus( runone.status , runone.jobid  )

return { message: "Run cancelled successfully" }



}

export const retryrun = async (runid: string) => {

    const run = await getrunbyid(runid)

    if(!run) {
        throw new Apperror(404, "Run not found")
    }

    if(run.status !== Status.FAILED) {
        throw new Apperror(400, "Can only retry failed runs")
    }

    const stepRuns = await getsteprunbyjobrun(runid)

    const failedSteps = stepRuns.filter(step => step.status === Status.FAILED)

    for(const step of failedSteps) {
        await updatesteprunstatus(Status.PENDING, step.steprunid)
    }

    const stepQueue = new Queue("step-execution", { connection: redisConnection })

    for(const step of failedSteps) {
        await stepQueue.add("execute-step", {
            jobRunId: runid,
            stepId: step.stepid,
            stepRunId: step.steprunid
        })
    }

    await updatejobrunstatus(Status.RUNNING, runid)

    return { message: "Run retried successfully" }
}