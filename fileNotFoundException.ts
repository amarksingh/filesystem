const fileNotFoundExceptionContract = require('@ostro/contracts/filesystem/fileNotFoundException')
/**
 * Class FileNotFoundException.
 */
class FileNotFoundException extends fileNotFoundExceptionContract {
    /**
     * Create a new instance.
     * @param {*} errors
     */
    constructor(errors) {
        super();

        this.name = this.constructor.name;
        this.message = 'Specefied file is not found';
        this.errors = errors;
        this.statusCode = 404;
        Error.captureStackTrace(this, this.constructor);

    }
}
module.exports = FileNotFoundException