import { WorkflowStep } from "./types"
import axios from "axios"

class WorkflowBuilder {
    private name : string
    private steps : WorkflowStep[]
    private apikey : string
    private baseUrl: string

    constructor(name : string , apiKey : string , baseUrl : string){

this.name = name 
this.steps = []
this.apikey = apiKey
this.baseUrl = baseUrl 

    }

    step(id : string , config : any) :WorkflowBuilder{

this.steps.push({
    id , 
    name:id , 
    type: "http",
    config,
    dependsOn :[]
})
return this
    }


    dependsOn(...Stepsids : string[] ):WorkflowBuilder{

const laststep = this.steps[this.steps.length - 1]

if(laststep){
    laststep.dependsOn = Stepsids
}
return this 
    }

    async register() :Promise <void>{
        const url = `${this.baseUrl}/api/workflows`

        await axios.post(url , {
            name : this.name,
            steps : this.steps 
        }, {
            headers : {
                 "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apikey}`
            }
            
        })

    }


}

export default WorkflowBuilder