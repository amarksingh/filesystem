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
    exists(error: any, data: Record<string, any>, callback: Function, path: string, options: Record<string, any>, basePath: any) {
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
    get(error: any, data: Record<string, any>, callback: Function, path: string, options: Record<string, any>, basePath: any) {
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
    delete(error: any, data: Record<string, any>, callback: Function, path: string, options: Record<string, any>, basePath: any) {
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
    put(error: any, data: Record<string, any>, callback: Function, path: string, options: Record<string, any>, basePath: any) {
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
    global(error: any, data: Record<string, any>, callback: Function, path: string, options: Record<string, any>) {
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
    createDir(error: any, data: Record<string, any>, callback: Function) {
        if (error) {
            callback(error)
        } else {
            callback(true)
        }
    }
}
module.exports = FilesystemHandler