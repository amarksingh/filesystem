const DirectoryCreateExceptionContract = require('@ostro/contracts/filesystem/directoryCreateException')
/**
 * Class DirectoryCreateException.
 */
class DirectoryCreateException extends DirectoryCreateExceptionContract {
    /**
     * Create a new instance.
     * @param {*} errors
     */
    constructor(errors: any) {
        super();

        this.name = this.constructor.name;
        this.message = 'Unable to create directory';
        this.errors = errors;
        this.statusCode = 404;
        Error.captureStackTrace(this, this.constructor);

    }
}
module.exports = DirectoryCreateException