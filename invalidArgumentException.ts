import InvalidArgumentExceptionContract from '@ostro/contracts/exception/invalidArgumentException';

/**
 * Class InvalidArgumentException.
 */
class InvalidArgumentException extends InvalidArgumentExceptionContract {
    name: string;
    message: string;
    statusCode: number;

    /**
     * Create a new instance.
     *
     * @param error - Error message.
     */
    constructor(error: string) {
        super();
        this.name = this.constructor.name;
        this.message = error;
        this.statusCode = 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

export = InvalidArgumentException;