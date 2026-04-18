
import Circuitbreaker from "./CircuitBreaker"
import { DagFloClientOptions, TriggerOptions, TriggerResult } from "./types"
import axios from "axios"

type TriggerApiResponse = {
    jobid: string
    message: string
}



class TriggerClient {
    private apikey : string 
    private baseUrl : string 
    private circuitbreaker : Circuitbreaker

    constructor(options : DagFloClientOptions){

        if(!options.apiKey) throw new Error("apikey is required")
            if(!options.baseUrl) throw new Error("baseUrl is wrong")



        this.apikey = options.apiKey
        this.baseUrl = options.baseUrl.replace(/\$/,"")
        this.circuitbreaker = new Circuitbreaker()

    }

async trigger(workflowid : string , options : TriggerOptions = {}) : Promise <TriggerResult>{

    if(!workflowid) throw new Error("workflowid required")

        const url = `${this.baseUrl}/api/runs/${workflowid}/trigger`

        const response = await this.circuitbreaker.execute(()=>{
          return  axios.post<TriggerApiResponse >(url, {input : options.input} , {
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${this.apikey}`
                }
            })
        })

        const runId = response.data.jobid
        const message = response.data.message

       return{
        runId , 
        message
       }



}





}

export default TriggerClient