const ServiceProvider = require('@ostro/support/serviceProvider');
const FilesystemManager = require('./filesystemManager');
const Filesystem = require('./filesystem');
/**
 * Class filesystemServiceProvider.
 */
class filesystemServiceProvider extends ServiceProvider {

    /**
     * register method.
     * @returns {any}
     */
    register() {
        this.registerNativeFilesystem();

        this.registerFlysystem();
    }

    /**
     * registerNativeFilesystem method.
     * @returns {any}
     */
    registerNativeFilesystem() {
        this.$app.singleton('files', function() {
            return new Filesystem;
        });
    }

    /**
     * registerFlysystem method.
     * @returns {any}
     */
    registerFlysystem() {
        this.registerManager();

        this.$app.singleton('filesystem.disk', ($app) => {
            return $app['filesystem'].disk(this.getDefaultDriver());
        });

        this.$app.singleton('filesystem.cloud', ($app) => {
            return $app['filesystem'].disk(this.getCloudDriver());
        });
    }

    /**
     * registerManager method.
     * @returns {any}
     */
    registerManager() {
        this.$app.singleton('filesystem', function($app) {
            return new FilesystemManager($app);
        });
    }

    /**
     * getDefaultDriver method.
     * @returns {any}
     */
    getDefaultDriver() {
        return this.$app['config']['filesystems.default'];
    }

    /**
     * getCloudDriver method.
     * @returns {any}
     */
    getCloudDriver() {
        return this.$app['config']['filesystems.cloud'];
    }
    
    /**
     * boot method.
     * @returns {any}
     */
    boot() {

    }

}
module.exports = filesystemServiceProvider