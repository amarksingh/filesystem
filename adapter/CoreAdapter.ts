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
    setConfig(config: Record<string, any>) {
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
    setPathPrefix(root: any) {
        this[kRootPath] = root
    }

    /**
     * setUrlPrefix method.
     * @param {*} root
     * @returns {any}
     */
    setUrlPrefix(root: any) {
        this[kRootUrlPath] = root
    }

    /**
     * applyPathPrefix method.
     * @param {*} dest
     * @returns {any}
     */
    applyPathPrefix(dest: any) {
        return path.resolve(path.join(this[kRootPath], path.join('/', path.normalize(dest))))
    }

    /**
     * applyUrlPrefix method.
     * @param {*} dest
     * @returns {any}
     */
    applyUrlPrefix(dest: any) {
        return url.resolve(([this[kRootUrlPath], (dest || '')].join('/')), '')
    }

    /**
     * ensureDirectory method.
     * @param {*} dir
     * @param {*} callback
     * @returns {any}
     */
    ensureDirectory(dir: any, callback: Function) {
        ensureDir(dir, callback)
    }

    /**
     * parsePath method.
     * @param {*} dest
     * @returns {any}
     */
    parsePath(dest: any) {
        return path.parse(dest)
    }

    /**
     * dirname method.
     * @param {*} dest
     * @returns {any}
     */
    dirname(dest: any) {
        return this.parsePath(dest).dir
    }

    /**
     * getContent method.
     * @param {*} content
     * @returns {any}
     */
    getContent(content: any) {
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
    getBufferData(content: any) {
        return this.getContent(content).buffer
    }
    /**
     * move method.
     * @param {*} path
     * @param {*} newpath
     * @param {*} callback
     * @returns {any}
     */
    move(path: string, newpath: any, callback: Function) {
        callback(this.formatError({ message: 'there was no such functionality available.' }), {})
    }

    /**
     * delete method.
     * @param {*} $path
     * @param {*} options
     * @param {*} callback
     * @returns {any}
     */
    delete($path: string, options: Record<string, any> = {}, callback: Function) {
        callback(this.formatError({ message: 'there was no such functionality available.' }), {})

    }

    /**
     * has method.
     * @param {*} $path
     * @param {*} options
     * @param {*} callback
     * @returns {any}
     */
    has($path: string, options: Record<string, any> = {}, callback: Function) {
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
    write($path: string, $contents: any, options: Record<string, any> = {}, ...rest: any[]) {
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
    read($path: string, options: Record<string, any> = {}, callback: Function) {
        callback(this.formatError({ message: 'there was no such functionality available.' }), {})

    }
    /**
     * formatError method.
     * @param {*} err
     * @returns {any}
     */
    formatError(err: any) {
        return {
            'message': 'Storage Error',
            'errors': err,
            'status': 500
        }
    }
}
module.exports = CoreAdapter