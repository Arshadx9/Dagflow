import { Worker } from "bullmq";
import redisConnection from "../../shared/config/redis";
import { workflowexecutor } from "../engine/workflowexecutor";
import { QUEUE_NAME } from "./queueconfig";
export const startWorker = () => {
    const worker = new Worker(QUEUE_NAME, async (job) => {
        await workflowexecutor(job.data);
    }, { connection: redisConnection });
    worker.on("completed", (job) => {
        console.log(`Job ${job.id} completed`);
    });
    worker.on("failed", (job, error) => {
        console.log(`Job ${job?.id} failed: ${error.message}`);
    });
    return worker;
};
