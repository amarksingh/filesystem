const InvalidArgumentExceptionContract = require('@ostro/contracts/exception/invalidArgumentException')
/**
 * Class InvalidArgumentException.
 */
class InvalidArgumentException extends InvalidArgumentExceptionContract {
    /**
     * Create a new instance.
     * @param {*} error
     */
    constructor(error: any) {
        super();
        this.name = this.constructor.name;
        this.message = error;
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);

    }
}
module.exports = InvalidArgumentException