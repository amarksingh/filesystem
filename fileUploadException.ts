import FileUploadExceptionContract from '@ostro/contracts/filesystem/fileUploadException';

/**
 * Class FileUploadException.
 */
class FileUploadException extends FileUploadExceptionContract {
    name: string;
    message: string;
    errors: unknown;
    statusCode: number;

    /**
     * Create a new instance.
     *
     * @param errors - Error details or message.
     */
    constructor(errors: unknown) {
        super();
        this.name = this.constructor.name;
        this.message = 'Error in upload file';
        this.errors = errors;
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default FileUploadException;