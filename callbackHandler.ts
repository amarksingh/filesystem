/**
 * Class FilesystemHandler.
 */
class FilesystemHandler {
    /**
     * exists method.
     * @param {*} error
     * @param {*} data
     * @param {*} callback
     * @param {*} path
     * @param {*} options
     * @param {*} basePath
     * @returns {any}
     */
    exists(error, data, callback, path, options, basePath) {
        if (error) {
            callback(error)
        } else {
            callback(data)
        }

    }

    /**
     * get method.
     * @param {*} error
     * @param {*} data
     * @param {*} callback
     * @param {*} path
     * @param {*} options
     * @param {*} basePath
     * @returns {any}
     */
    get(error, data, callback, path, options, basePath) {
        if (error) {
            callback(error)
        } else {
            callback(data)
        }
    }

    /**
     * delete method.
     * @param {*} error
     * @param {*} data
     * @param {*} callback
     * @param {*} path
     * @param {*} options
     * @param {*} basePath
     * @returns {any}
     */
    delete(error, data, callback, path, options, basePath) {
        if (error) {
            callback(error)
        } else {
            callback(data)
        }
    }

    /**
     * put method.
     * @param {*} error
     * @param {*} data
     * @param {*} callback
     * @param {*} path
     * @param {*} options
     * @param {*} basePath
     * @returns {any}
     */
    put(error, data, callback, path, options, basePath) {
        if (error) {
            callback(error)
        } else {
            callback(data)
        }
    }
    /**
     * global method.
     * @param {*} error
     * @param {*} data
     * @param {*} callback
     * @param {*} path
     * @param {*} options
     * @returns {any}
     */
    global(error, data, callback, path, options) {
        if (error) {
            callback(error)
        } else {
            callback(data)
        }
    }
    /**
     * createDir method.
     * @param {*} error
     * @param {*} data
     * @param {*} callback
     * @returns {any}
     */
    createDir(error, data, callback) {
        if (error) {
            callback(error)
        } else {
            callback(true)
        }
    }
}
module.exports = FilesystemHandler