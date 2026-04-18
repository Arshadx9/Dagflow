import { DagFloClientOptions, TriggerOptions, TriggerResult, RunStatus } from "./types"
import TriggerClient from "./TriggerClient"
import WorkflowBuilder from "./WorkflowBuilder"
import axios from "axios"

class DagFloClient {
    private apiKey: string
    private baseUrl: string
    private triggerClient: TriggerClient

    constructor(options: DagFloClientOptions) {
        if(!options.apiKey) throw new Error("apiKey is required")
        if(!options.baseUrl) throw new Error("baseUrl is required")

        this.apiKey = options.apiKey
        this.baseUrl = options.baseUrl.replace(/\/$/, "")
        this.triggerClient = new TriggerClient(options)
    }

    async trigger(workflowId: string, options: TriggerOptions = {}): Promise<TriggerResult> {
        return this.triggerClient.trigger(workflowId, options)
    }

    workflow(name: string): WorkflowBuilder {
        return new WorkflowBuilder(name, this.apiKey, this.baseUrl)
    }

    async getRunStatus(runId: string): Promise<RunStatus> {
        const response = await axios.get(
            `${this.baseUrl}/api/runs/${runId}/detail`,
            {
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`
                }
            }
        )
        return response.data.data
    }
}

export default DagFloClient