import { Queue } from "bullmq"
import redisConnection from "../../shared/config/redis"
import { QUEUE_NAME, defaultjobs } from "./queueconfig"

export const stepQueue = new Queue(QUEUE_NAME, { connection: redisConnection })

export const pushtoqueue = async (jobdata: any) => {
	await stepQueue.add("execute-step", jobdata, {
		...defaultjobs,
	})
}
