module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    let geterr =  {
        status_code: statusCode,
        message: err.message,
        validation: err.validation  
    }
    console.log("🚀 ~ file: errorHandler.js ~ line 16 ~ geterr", geterr)
    return res.status(statusCode).json(geterr);
}