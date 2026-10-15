const util = require('util');
require('@ostro/support/helpers')
const Manager = require('@ostro/support/manager')
const InvalidArgumentException = require('./invalidArgumentException')
const FilesystemAdapter = require('./filesystemAdapter')
const callbackHandler = require('./callbackHandler')
const kHandler = Symbol('handler')
/**
 * Class FileSystemManager.
 */
class FileSystemManager extends Manager {

    $type = 'filesystem';

    /**
     * Create a new instance.
     * @param {*} $app
     */
    constructor($app: any) {
        super($app)
        this[kHandler] = this.getConfig('handler')
        if (!this[kHandler]) {
            this[kHandler] = new callbackHandler();
        } else if (typeof this[kHandler] == 'function') {
            util.inherits(this[kHandler], callbackHandler);
            this[kHandler] = new this[kHandler]();
        } else if (typeof this[kHandler] == 'object') {
            let HandlerClass = this[kHandler].constructor;
            if (HandlerClass && HandlerClass !== Object) {
                util.inherits(HandlerClass, callbackHandler);
                this[kHandler] = Object.assign(new HandlerClass(), this[kHandler]);
            } else {
                this[kHandler] = Object.assign(new callbackHandler(), this[kHandler]);
            }
        }
    }

    /**
     * drive method.
     * @param {*} $name
     * @returns {any}
     */
    drive($name: any = null) {
        return this.driver($name);
    }

    /**
     * disk method.
     * @param {*} name
     * @returns {any}
     */
    disk(name: any = null) {
        return this.driver(name)
    }

    /**
     * cloud method.
     * @returns {any}
     */
    cloud() {
        var name = this.getDefaultCloudDriver();
        return this.disk(name)
    }

    /**
     * resolve method.
     * @param {*} $name
     * @returns {any}
     */
    resolve($name: string) {
        var $config = this.getConfig($name);
        if (!$config) {
            throw new InvalidArgumentException("Disk [" + $name + "] was not available.");
        }
        return super.resolve($name, $config)
    }


    /**
     * createLocalDriver method.
     * @param {*} $config
     * @returns {any}
     */
    createLocalDriver($config: Record<string, any>) {
        return this.adapt(new(require('./adapter/local'))($config['root'], $config), $config);
    }

    /**
     * createAzureDriver method.
     * @param {*} $config
     * @returns {any}
     */
    createAzureDriver($config: Record<string, any>) {
        return this.adapt(new(require('./adapter/azure'))(new(require('./clients/azure'))($config), $config), $config);
    }

    /**
     * createS3Driver method.
     * @param {*} $config
     * @returns {any}
     */
    createS3Driver($config: Record<string, any>) {
        return this.adapt(new(require('./adapter/s3'))(new(require('./clients/s3'))($config), $config), $config);
    }

    /**
     * adapt method.
     * @param {*} adapter
     * @param {*} config
     * @returns {any}
     */
    adapt(adapter: any, config: Record<string, any>) {
        return new FilesystemAdapter(adapter, this[kHandler]);
    }

    /**
     * getConfig method.
     * @param {*} name
     * @returns {any}
     */
    getConfig(name: string) {
        return super.getConfig(`disks.${name}`) || super.getConfig(name);
    }

    /**
     * getDefaultCloudDriver method.
     * @returns {any}
     */
    getDefaultCloudDriver() {
        return super.getConfig('cloud');
    }

    /**
     * registerToRequest method.
     * @param {*} FileRequest
     * @returns {any}
     */
    registerToRequest(FileRequest: any) {
        let self = this
        FileRequest.prototype.store = function(dir, disk, options) {
            dir = dir || '';
            options = typeof disk == 'object' ? disk : (options || {});
            disk = typeof disk == 'object' ? '' : (disk || '');
            return self.disk((disk || self.getDefaultDriver())).putFile(dir, this, options)
        }
        FileRequest.prototype.storeAs = function(dir, filename, disk, options) {
            dir = dir || '';
            options = typeof disk == 'object' ? disk : (options || {});
            disk = typeof disk == 'object' ? '' : (disk || '');
            return self.disk((disk || self.getDefaultDriver())).putFileAs(dir, this, filename, options)
        }

    }

}

module.exports = FileSystemManager