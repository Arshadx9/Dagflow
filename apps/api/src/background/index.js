import { startWorker } from "./queue/consumer";
import { cronpoller } from "./scheduler/cronpoller";
let worker = null;
let stopCronPoller = null;
export const startBackgroundJobs = () => {
    if (process.env.ENABLE_BACKGROUND_JOBS === "false") {
        console.log("Background jobs disabled by ENABLE_BACKGROUND_JOBS=false");
        return;
    }
    try {
        worker = startWorker();
        console.log("Background worker started");
    }
    catch (error) {
        console.error("Failed to start background worker:", error);
    }
    // Start scheduler asynchronously so it doesn't block API startup
    // Scheduler will retry on connection errors
    setImmediate(() => {
        try {
            stopCronPoller = cronpoller();
            console.log("Scheduler loop started");
        }
        catch (error) {
            console.error("Failed to start scheduler:", error);
        }
    });
    console.log("DagFlo background jobs initialization complete");
};
export const stopBackgroundJobs = async () => {
    if (stopCronPoller) {
        stopCronPoller();
        stopCronPoller = null;
    }
    if (worker) {
        await worker.close();
        worker = null;
    }
};
