import { stepexecutor } from "./stepexecutor";
export const workflowexecutor = async (jobData) => {
    await stepexecutor(jobData);
};
