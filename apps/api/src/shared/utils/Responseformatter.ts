class Responseformatter {


static success (message : string, data : any = null){
    return {
        success : true ,
        data : data ,
        message : message
    }
}

static error (data : any = null ){
    return {
        success : false ,
       
        data : data 
    }
}

}

export default Responseformatter
