const path = require('path')
const FileNotFoundException = require('./fileNotFoundException')
const FileDeleteException = require('./fileDeleteException')
const FileUploadException = require('./fileUploadException')
const DirectoryCreateException = require('./directoryCreateException')
const kAdapter = Symbol('adapter')
const kHandler = Symbol('handler')
/**
 * Class FilesystemAdapter.
 */
class FilesystemAdapter {
    /**
     * Create a new instance.
     * @param {*} $adapter
     * @param {*} $handler
     */
    constructor($adapter: any, $handler: Function) {
        this[kAdapter] = $adapter;
        this[kHandler] = $handler;
    }

    /**
     * exists method.
     * @param {*} $path
     * @param {*} options
     * @returns {any}
     */
    exists($path: string, options: Record<string, any>) {

        return new Promise((resolve, reject) => {
            this[kAdapter].has($path, options, (err, data, basePath) => {
                this[kHandler].exists(null, (err ? false : true), resolve, $path, options, basePath)
            })
        })
    }

    /**
     * path method.
     * @param {*} $path
     * @returns {any}
     */
    path($path: string) {
        if (typeof this[kAdapter].applyPathPrefix == "function") {
            return this[kAdapter].applyPathPrefix($path);
        }
        return this[kAdapter].getAdapter().getPathPrefix()[$path];
    }

    /**
     * get method.
     * @param {*} $path
     * @param {*} options
     * @returns {any}
     */
    get($path: string, options: Record<string, any>) {

        return new Promise((resolve, reject) => {
            this[kAdapter].read($path, options, (err, data, basePath) => {
                if (err) {
                    this[kHandler].get(new FileNotFoundException(err), null, reject, $path, options, basePath)
                } else {
                    this[kHandler].get(null, (typeof data == 'function' ? data() : data), resolve, $path, options, basePath)
                }
            })
        })
    }

    /**
     * delete method.
     * @param {*} $path
     * @param {*} rest
     * @returns {any}
     */
    delete($path: string, ...rest: any[]) {
        rest = Array.from(rest)
        let callback = rest.find(arg => typeof arg == 'function')
        let options = rest.find(arg => typeof arg == 'object') || {}
        if (callback)
            return this[kAdapter].delete($path, options, callback)
        else {
            return new Promise((resolve, reject) => {
                this[kAdapter].delete($path, options, (err, data, basePath) => {
                    if (err) {
                        this[kHandler].delete(new FileDeleteException(err), null, reject, $path, options, basePath)
                    } else {
                        this[kHandler].delete(null, (typeof data == 'function' ? data() : data), resolve, $path, options, basePath)
                    }
                })
            })
        }
    }

    /**
     * makeDirectory method.
     * @param {*} $path
     * @param {*} options
     * @returns {any}
     */
    makeDirectory($path: string, options: Record<string, any>) {
        return new Promise((resolve, reject) => {
            this[kAdapter].createDir($path, options, (err, data, basePath) => {
                if (err) {
                    this[kHandler].createDir(new DirectoryCreateException(err), null, reject, $path, options, basePath)
                } else {
                    this[kHandler].createDir(null, (typeof data == 'function' ? data() : data), resolve, $path, options, basePath)
                }
            })
        })
    }

    /**
     * put method.
     * @param {*} $path
     * @param {*} content
     * @param {*} options
     * @returns {any}
     */
    put($path: string, content: any, options: Record<string, any> = {}) {

        return new Promise((resolve, reject) => {
            this[kAdapter].write($path, content, options, (err, data, basePath) => {
                if (err) {
                    this[kHandler].delete(new FileUploadException(err), null, reject, $path, options, basePath, content)
                } else {
                    this[kHandler].put(null, (typeof data == 'function' ? data() : data), resolve, $path, options, basePath)
                }
            })
        })
    }

    /**
     * putFile method.
     * @param {*} $path
     * @param {*} $file
     * @param {*} $options
     * @returns {any}
     */
    putFile($path: string, $file: any, $options: Record<string, any> = {}) {
        return this.putFileAs($path, $file, $file.getHashname(), $options);
    }

    /**
     * putFileAs method.
     * @param {*} $path
     * @param {*} $file
     * @param {*} $name
     * @param {*} $options
     * @returns {any}
     */
    putFileAs($path: string, $file: any, $name: string, $options: Record<string, any> = {}) {
        $path = path.join($path, $name)
        return this.put($path, $file.getBufferData(), $options);
    }

    /**
     * getAdapter method.
     * @returns {any}
     */
    getAdapter() {
        return this[kAdapter];
    }

}
module.exports = FilesystemAdapter