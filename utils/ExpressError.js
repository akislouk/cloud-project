// Extends the Error class to include a status
class ExpressError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}

export default ExpressError;
