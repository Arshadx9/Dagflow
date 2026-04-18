export const QUEUE_NAME = "step-execution";
export const defaultjobs = {
    attempts: 1,
    backoff: {
        type: "exponential",
        delay: 2000,
    },
};
