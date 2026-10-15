const path = require('path')
const url = require('url')
const { ensureDir } = require('fs-extra')
const kConfig = Symbol('config')
const kRootPath = Symbol('rootPath')
const kRootUrlPath = Symbol('rootUrlPath')
/**
 * Class CoreAdapter.
 */
class CoreAdapter {
    /**
     * setConfig method.
     * @param {*} config
     * @returns {any}
     */
    setConfig(config) {
        this[kConfig] = config
    }

    /**
     * getConfig method.
     * @returns {any}
     */
    getConfig() {
        return this[kConfig] || null
    }

    /**
     * setPathPrefix method.
     * @param {*} root
     * @returns {any}
     */
    setPathPrefix(root) {
        this[kRootPath] = root
    }

    /**
     * setUrlPrefix method.
     * @param {*} root
     * @returns {any}
     */
    setUrlPrefix(root) {
        this[kRootUrlPath] = root
    }

    /**
     * applyPathPrefix method.
     * @param {*} dest
     * @returns {any}
     */
    applyPathPrefix(dest) {
        return path.resolve(path.join(this[kRootPath], path.join('/', path.normalize(dest))))
    }

    /**
     * applyUrlPrefix method.
     * @param {*} dest
     * @returns {any}
     */
    applyUrlPrefix(dest) {
        return url.resolve(([this[kRootUrlPath], (dest || '')].join('/')), '')
    }

    /**
     * ensureDirectory method.
     * @param {*} dir
     * @param {*} callback
     * @returns {any}
     */
    ensureDirectory(dir, callback) {
        ensureDir(dir, callback)
    }

    /**
     * parsePath method.
     * @param {*} dest
     * @returns {any}
     */
    parsePath(dest) {
        return path.parse(dest)
    }

    /**
     * dirname method.
     * @param {*} dest
     * @returns {any}
     */
    dirname(dest) {
        return this.parsePath(dest).dir
    }

    /**
     * getContent method.
     * @param {*} content
     * @returns {any}
     */
    getContent(content) {
        if (Array.isArray(content))
            return content[0]
        else
            return content
    }

    /**
     * getBufferData method.
     * @param {*} content
     * @returns {any}
     */
    getBufferData(content) {
        return this.getContent(content).buffer
    }
    /**
     * move method.
     * @param {*} path
     * @param {*} newpath
     * @param {*} callback
     * @returns {any}
     */
    move(path, newpath, callback) {
        callback(this.formatError({ message: 'there was no such functionality available.' }), {})
    }

    /**
     * delete method.
     * @param {*} $path
     * @param {*} options
     * @param {*} callback
     * @returns {any}
     */
    delete($path, options = {}, callback) {
        callback(this.formatError({ message: 'there was no such functionality available.' }), {})

    }

    /**
     * has method.
     * @param {*} $path
     * @param {*} options
     * @param {*} callback
     * @returns {any}
     */
    has($path, options = {}, callback) {
        callback(this.formatError({ message: 'there was no such functionality available.' }), {})

    }

    /**
     * write method.
     * @param {*} $path
     * @param {*} $contents
     * @param {*} options
     * @param {*} rest
     * @returns {any}
     */
    write($path, $contents, options = {}, ...rest) {
        let callback = Array.from(rest).find(arg => typeof arg == "function") || (typeof options == "function" ? options : () => {});
        callback(this.formatError({ message: 'there was no such functionality available.' }), {})

    }

    /**
     * read method.
     * @param {*} $path
     * @param {*} options
     * @param {*} callback
     * @returns {any}
     */
    read($path, options = {}, callback) {
        callback(this.formatError({ message: 'there was no such functionality available.' }), {})

    }
    /**
     * formatError method.
     * @param {*} err
     * @returns {any}
     */
    formatError(err) {
        return {
            'message': 'Storage Error',
            'errors': err,
            'status': 500
        }
    }
}
module.exports = CoreAdapter