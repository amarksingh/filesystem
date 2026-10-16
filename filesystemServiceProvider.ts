import ServiceProvider from '@ostro/support/serviceProvider';
import FilesystemManager from './filesystemManager';
import Filesystem from './filesystem';

/**
 * Class filesystemServiceProvider.
 */
class filesystemServiceProvider extends ServiceProvider {

    /**
     * register method.
     */
    register(): void {
        this.registerNativeFilesystem();
        this.registerFlysystem();
    }

    /**
     * registerNativeFilesystem method.
     */
    registerNativeFilesystem(): void {
        this.$app.singleton('files', function(): Filesystem {
            return new Filesystem();
        });
    }

    /**
     * registerFlysystem method.
     */
    registerFlysystem(): void {
        this.registerManager();

        this.$app.singleton('filesystem.disk', ($app: any): any => {
            return $app['filesystem'].disk(this.getDefaultDriver());
        });

        this.$app.singleton('filesystem.cloud', ($app: any): any => {
            return $app['filesystem'].disk(this.getCloudDriver());
        });
    }

    /**
     * registerManager method.
     */
    registerManager(): void {
        this.$app.singleton('filesystem', function($app: any): FilesystemManager {
            return new FilesystemManager($app);
        });
    }

    /**
     * getDefaultDriver method.
     *
     * @returns Default driver name.
     */
    getDefaultDriver(): string {
        return this.$app['config']['filesystems.default'];
    }

    /**
     * getCloudDriver method.
     *
     * @returns Cloud driver name.
     */
    getCloudDriver(): string {
        return this.$app['config']['filesystems.cloud'];
    }

    /**
     * boot method.
     */
    boot(): void {
    }
}

export = filesystemServiceProvider;