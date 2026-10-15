const FileUploadExceptionContract = require('@ostro/contracts/filesystem/fileUploadException')
/**
 * Class FileUploadException.
 */
class FileUploadException extends FileUploadExceptionContract {
    /**
     * Create a new instance.
     * @param {*} errors
     */
    constructor(errors) {
        super();
        this.name = this.constructor.name;
        this.message = 'Error in upload file';
        this.errors = errors
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);

    }
}
module.exports = FileUploadException