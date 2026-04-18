export  type DagFloClientOptions ={
      apiKey: string
    baseUrl: string
}

export    type TriggerOptions  =     
{
    input?: any
}

 export   type  TriggerResult =
{
    runId: string
    message: string
}

export   type  RunStatus  =     
{
    runId: string
    status: string
    steps: any[]
}

 export    type WorkflowStep  =
{
    id: string
    name: string
    type: string
    config?: any
    dependsOn?: string[]
}
