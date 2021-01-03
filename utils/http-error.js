class HttpError extends Error{
    constructor(message,errorCode,isOperational){
        super(message);
        this.code = errorCode;
        this.isOperational = isOperational;
    }
}

module.exports = HttpError;