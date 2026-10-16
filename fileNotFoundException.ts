import FileNotFoundExceptionContract from '@ostro/contracts/filesystem/fileNotFoundException';

/**
 * Class FileNotFoundException.
 */
class FileNotFoundException extends FileNotFoundExceptionContract {
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
        this.message = 'Specefied file is not found';
        this.errors = errors;
        this.statusCode = 404;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default FileNotFoundException;