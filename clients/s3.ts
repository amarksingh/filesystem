const { S3 } = require("aws-sdk");
const kConnection = Symbol('connection')

/**
 * Class S3Client.
 */
class S3Client {
    /**
     * Create a new instance.
     * @param {*} $config
     */
    constructor($config: Record<string, any>) {
        this.applyConnection($config)
        return this
    }
    /**
     * getConnection method.
     * @returns {any}
     */
    getConnection() {
        return this[kConnection]
    }
    /**
     * applyConnection method.
     * @param {*} $config
     * @returns {any}
     */
    applyConnection($config: Record<string, any>) {
        this[kConnection] = new S3({ accessKeyId: $config['key'], secretAccessKey: $config['secret'], params: { Bucket: $config['bucket'] } })
    }

}
module.exports = S3Client