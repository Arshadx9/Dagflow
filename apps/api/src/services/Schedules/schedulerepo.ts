import prisma from "../../shared/utils/Prisma" 
import { ScheduleStatus } from "@prisma/client"



export const createschedule = async(worflwid : string , cron: string , nextRunAt : Date)=>{

return await prisma.schedule.create({
    data : {
        workflowid : worflwid,
        cron : cron,
        nextRunAt : nextRunAt
    }
}) 

} 

export const getschedulebyowner = async(ownerid : string) => {
    return await prisma.schedule.findMany({
        where : {
            wf :{
                creatorId : ownerid 
            }
        }
    })
}

export const deleteschedulerepo = async(scheduleId : string) => {

    await prisma.schedule.delete({
        where: {
      scheduleid : scheduleId

        }
    })
    
}

export const updateschedule = async (scheduleid : string , schedulestatus : ScheduleStatus) => {
    await prisma.schedule.update({
        where : {
              scheduleid : scheduleid 
        } , 
        data : {
            schedulestatus : schedulestatus
        }
    })
}