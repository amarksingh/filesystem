const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const kContainer = Symbol('container')
const kConnection = Symbol('connection')
/**
 * Class AzureClient.
 */
class AzureClient {
    /**
     * Create a new instance.
     * @param {*} $config
     */
    constructor($config: Record<string, any>) {
        this[kConnection] = this.getConnection($config['account'], Buffer.from($config['key'], 'base64').toString('ascii'));
        this[kContainer] = this.getContainer($config['container']);
        return this
    }
    /**
     * getConnection method.
     * @param {*} account
     * @param {*} key
     * @returns {any}
     */
    getConnection(account: any, key: string) {
        if (account || key) {
            return new BlobServiceClient(
                `https://${account}.blob.core.windows.net`,
                new StorageSharedKeyCredential(account, key)
            );
        }
        return this[kConnection]
    }
    /**
     * getContainer method.
     * @param {*} container
     * @returns {any}
     */
    getContainer(container: any) {
        if (container) {
            return this[kConnection].getContainerClient(container)
        }
        return this[kContainer]
    }

}
module.exports = AzureClient