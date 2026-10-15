const CoreAdapter = require('./CoreAdapter')
const kClient = Symbol('client')
const kHandler = Symbol('handler')
const { v4 } = require("uuid");
const path = require('path')

/**
 * Class Azure.
 */
class Azure extends CoreAdapter {

    /**
     * Create a new instance.
     * @param {*} $client
     * @param {*} $config
     */
    constructor($client: any, $config: Record<string, any>) {
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
    read($path: string, options: Record<string, any> = {}, callback: Function) {
        let basePath = this.applyUrlPrefix();
        $path = $path.replaceAll('\\', '/')
        if ($path.charAt(0) == "/") {
            $path = $path.substr(1)
        }
        this[kClient].getConnection().getObject({ Key: $path }).promise()
            .then(response => ({ error: null, data: response.Body }))
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
    write($path: string, data: Record<string, any>, options: Record<string, any> = {}, callback: Function) {

        $path = $path.replaceAll('\\', '/')
        if ($path.charAt(0) == "/") {
            $path = $path.substr(1)
        }
        let basePath = this.applyUrlPrefix();
        this[kClient].getConnection().upload({
                Key: $path,
                Body: data.toString("base64"),
            }).promise()

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