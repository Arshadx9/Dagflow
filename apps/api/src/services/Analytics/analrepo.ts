 import { Status } from "@prisma/client"
import prisma from "../../shared/utils/Prisma" 

 export const getTotalRuns = async (ownerID : string) => {

  return   await prisma.jobRun.count({
        where:{
            wf: {creatorId : ownerID},
            status:Status.FINISHED
        }
    })

 }

 export const getSuccessRate = async(ownerID : string) => {

    const totalruns = await getTotalRuns(ownerID)

    const SuccessfulRuns = await prisma.jobRun.count({
        where : {
            wf : {creatorId : ownerID},
            status : Status.FINISHED
        }
    })

    if(totalruns  === 0){
   return 0
    }

    return (SuccessfulRuns / totalruns) * 100 

 }

export const getAverageDuration = async (ownerId: string) => {

    const runs = await prisma.jobRun.findMany({
        where: {
            wf: { creatorId: ownerId },
            endtime: { not: null }
        },
        select: {
            starttime: true,
            endtime: true
        }
    })

    if(runs.length === 0) return 0

    const avgDuration = runs.reduce((acc, run) => {
        return acc + (run.endtime!.getTime() - run.starttime.getTime())
    }, 0) / runs.length

    return avgDuration
}

export const getRunVolumeByDay = async (ownerId : string) => {
    
}