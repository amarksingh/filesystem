const fileNotFoundExceptionContract = require('@ostro/contracts/filesystem/fileNotFoundException')
/**
 * Class FileNotFoundException.
 */
class FileNotFoundException extends fileNotFoundExceptionContract {
    /**
     * Create a new instance.
     * @param {*} errors
     * @param {*} path
     */
    constructor(errors, path) {
        super();
        this.name = this.constructor.name;
        this.message = 'Unable to delete ';
        this.errors = errors;
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);

    }
}
module.exports = FileNotFoundException