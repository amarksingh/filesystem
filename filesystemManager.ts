const util = require('util');
require('@ostro/support/helpers')
const Manager = require('@ostro/support/manager')
const InvalidArgumentException = require('./invalidArgumentException')
const FilesystemAdapter = require('./filesystemAdapter')
const callbackHandler = require('./callbackHandler')
const kHandler = Symbol('handler')
class FileSystemManager extends Manager {

    $type = 'filesystem';

    constructor($app) {
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

    drive($name = null) {
        return this.driver($name);
    }

    disk(name = null) {
        return this.driver(name)
    }

    cloud() {
        var name = this.getDefaultCloudDriver();
        return this.disk(name)
    }

    resolve($name) {
        var $config = this.getConfig($name);
        if (!$config) {
            throw new InvalidArgumentException("Disk [" + $name + "] was not available.");
        }
        return super.resolve($name, $config)
    }


    createLocalDriver($config) {
        return this.adapt(new(require('./adapter/local'))($config['root'], $config), $config);
    }

    createAzureDriver($config) {
        return this.adapt(new(require('./adapter/azure'))(new(require('./clients/azure'))($config), $config), $config);
    }

    createS3Driver($config) {
        return this.adapt(new(require('./adapter/s3'))(new(require('./clients/s3'))($config), $config), $config);
    }

    adapt(adapter, config) {
        return new FilesystemAdapter(adapter, this[kHandler]);
    }

    getConfig(name) {
        return super.getConfig(`disks.${name}`) || super.getConfig(name);
    }

    getDefaultCloudDriver() {
        return super.getConfig('cloud');
    }

    registerToRequest(FileRequest) {
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