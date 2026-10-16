import { S3 } from 'aws-sdk';

const kConnection: unique symbol = Symbol('connection');

/**
 * Class S3Client.
 */
class S3Client {
    [kConnection]: any;

    /**
     * Create a new instance.
     *
     * @param $config - S3 connection options.
     */
    constructor($config: Record<string, any>) {
        this.applyConnection($config);
        return this;
    }

    /**
     * getConnection method.
     *
     * @returns S3 instance.
     */
    getConnection(): any {
        return this[kConnection];
    }

    /**
     * applyConnection method.
     *
     * @param $config - S3 connection options.
     */
    applyConnection($config: Record<string, any>): void {
        this[kConnection] = new S3({
            accessKeyId: $config['key'],
            secretAccessKey: $config['secret'],
            params: { Bucket: $config['bucket'] }
        });
    }
}

export = S3Client;