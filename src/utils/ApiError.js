class ApiError{
    constructor(
        statusCode,
        message ="Internal Server Error",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode = statusCode;
        this.data=null
        this.errors = true;
        this.message = message;
        this.success=false;
        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}


export {ApiError}