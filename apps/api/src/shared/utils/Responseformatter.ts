class Responseformatter {


static success (message : string, data : any = null){
    return {
        success : true ,
        data : data ,
        message : message
    }
}

static error (message : string , data : any = null ){
    return {
        success : false ,
        message : "something went wrong ", 
        data : data 
    }
}





}