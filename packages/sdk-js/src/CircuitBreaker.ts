class Circuitbreaker {

private state : "CLOSED" | "OPEN" | "HALF_OPEN"
private failureCount : number 
private lastFailuretime : number 
private maxFailure : number 
private timeout : number

constructor (maxFailure : number =  3 , timeout : number = 30000) {


    this.state = "CLOSED"
    this.failureCount = 0 
    this.lastFailuretime = 0 
    this.maxFailure = maxFailure
    this.timeout = timeout

}

async execute <T>(operation :()=> Promise<T> | T) : Promise<T> {
   
const now = Date.now()

const timeSinceLastFailure = now - this.lastFailuretime

if(this.state === "OPEN"){

    if(timeSinceLastFailure >= this.timeout){
    this.state = "HALF_OPEN";
}

else{
    throw new Error("Circuit is Open , Request blocked")
}


}


try{
    const result = await Promise.resolve(operation());
    this.failureCount = 0 

    if(this.state==="HALF_OPEN"){
        this.state = "CLOSED"
    }
    return result;

}catch(error){
    this.failureCount++
    this.lastFailuretime = Date.now()

    if(this.failureCount >= this.maxFailure){
        this.state="OPEN"
    }
    throw error;
}



}


}

export default  Circuitbreaker