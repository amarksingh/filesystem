const CoreAdapter = require('./CoreAdapter')
const kClient = Symbol('client')
const kHandler = Symbol('handler')
/**
 * Class Azure.
 */
class Azure extends CoreAdapter {

    /**
     * Create a new instance.
     * @param {*} $client
     * @param {*} $config
     */
    constructor($client, $config) {
        super()
        this[kClient] = $client;
        this[kHandler] = typeof $config.handler == 'function' ? new $config.handler : typeof $config.handler == 'object' ? $config.handler : {};
        this.setUrlPrefix(this[kClient].url)
    }

    /**
     * read method.
     * @param {*} $path
     * @param {*} options
     * @param {*} callback
     * @returns {any}
     */
    read($path, options = {}, callback) {
        let basePath = this.applyUrlPrefix();
        this[kClient].getContainer(options.container).getBlockBlobClient($path).downloadToBuffer()
            .then(data => ({ error: null, data: data }))
            .catch(error => Promise.resolve({ error, data: null }))
            .then(({ error, data }) => {
                if (typeof this[kHandler].read == 'function') {
                    this[kHandler].read({
                        path: $path,
                        options,
                        callback,
                        error,
                        basePath,
                        contents: data
                    })
                } else {
                    /**
                     * callback method.
                     * @param {*} error
                     * @param {*} function(
                     * @returns {any}
                     */
                    callback(error, function() {
                        return {
                            'type': 'file',
                            'path': $path,
                            'contents': (options.dataType == 'base64') ? data.toString('base64') : data.toString(),
                        }
                    }, basePath)
                }
            });
    }
    /**
     * write method.
     * @param {*} $path
     * @param {*} data
     * @param {*} options
     * @param {*} callback
     * @returns {any}
     */
    write($path, data, options = {}, callback) {
        let basePath = this.applyUrlPrefix();
        this[kClient].getContainer(options.container).getBlockBlobClient($path).upload(data, data.length)
            .then(response => ({ error: null, response }))
            .catch(error => Promise.resolve({ error, response: null }))
            .then(({ error, response }) => {
                if (typeof this[kHandler].write == 'function') {
                    this[kHandler].write({
                        path: $path,
                        options,
                        callback,
                        error,
                        basePath,
                        response,
                        contents: data
                    })
                } else {
                    /**
                     * callback method.
                     * @param {*} error
                     * @param {*} function(
                     * @returns {any}
                     */
                    callback(error, function() {
                        return {
                            'type': 'file',
                            'path': $path,
                            'message': 'File uploaded successfully'
                        }
                    }, basePath)
                }
            });
    }

}
module.exports = Azure