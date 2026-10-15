import type { IFilesystem } from '@ostro/contracts/filesystem/filesystem';

const FilesystemContract = require('@ostro/contracts/filesystem/filesystem');
const fs = require('fs-extra');
const Finder = require('filehound');
const path = require('path');
const FileNotFoundException = require('./fileNotFoundException');
const FileDeleteException = require('./fileDeleteException');
const FileUploadException = require('./fileUploadException');
const DirectoryCreateException = require('./directoryCreateException');

/**
 * Class Filesystem.
 */
class Filesystem extends FilesystemContract implements IFilesystem {

    /**
     * exists method.
     * @param {*} $path
     * @returns {any}
     */
    exists($path: string) {
        return fs.access($path).then(res => true).catch(err => Promise.resolve(false));
    }

    /**
     * missing method.
     * @async
     * @param {*} $path
     * @returns {any}
     */
    async missing($path: string) {
        return !(await this.exists($path));
    }

    /**
     * get method.
     * @param {*} $path
     * @returns {any}
     */
    get($path: string) {
        return fs.readFile($path, 'utf8').catch(err => {
            throw new FileNotFoundException(`File does not exist at path ${$path}.`);
        })

    }

    /**
     * put method.
     * @param {*} $path
     * @param {*} $contents
     * @returns {any}
     */
    put($path: string, $contents: any) {
        return fs.writeFile($path, $contents);
    }

    /**
     * replaceInFile method.
     * @param {*} $search
     * @param {*} $replace
     * @param {*} $path
     * @returns {any}
     */
    replaceInFile($search: any, $replace: any, $path: string) {
        return this.get($path).then(content => this.put($path, content.replace($search, $replace)));
    }

    /**
     * prepend method.
     * @async
     * @param {*} $path
     * @param {*} $data
     * @returns {any}
     */
    async prepend($path: string, $data: Record<string, any>) {
        if (await this.exists($path)) {
            const existing = await this.get($path);
            return this.put($path, $data + existing);
        }
        return this.put($path, $data);
    }

    /**
     * append method.
     * @param {*} $path
     * @param {*} $data
     * @returns {any}
     */
    append($path: string, $data: Record<string, any>) {
        return fs.appendFile($path, $data);
    }

    /**
     * chmod method.
     * @param {*} $path
     * @param {*} $mode
     * @returns {any}
     */
    chmod($path: string, $mode: any = null) {
        if ($mode) {
            return fs.chmod($path, $mode);
        }
        return fs.stat($path).then(stat => {
            return stat.mode
        });

    }

    /**
     * delete method.
     * @async
     * @param {*} $paths
     * @returns {any}
     */
    async delete($paths: any) {
        $paths = Array.isArray($paths) ? $paths : arguments;

        let $success = true;

        for (let $path of $paths) {
            try {
                await fs.remove($path);
            } catch ($e) {
                $success = false;
            }
        }

        return $success;
    }

    /**
     * move method.
     * @param {*} $path
     * @param {*} $target
     * @returns {any}
     */
    move($path: string, $target: Record<string, any>) {
        return fs.move($path, $target);
    }

    /**
     * copy method.
     * @param {*} $path
     * @param {*} $target
     * @returns {any}
     */
    copy($path: string, $target: Record<string, any>) {
        return fs.copy($path, $target);
    }

    /**
     * link method.
     * @param {*} $target
     * @param {*} $link
     * @param {*} $force
     * @returns {any}
     */
    link($target: Record<string, any>, $link: any, $force: boolean = false) {
        return fs.symlink($target, $link, 'junction')
    }

    /**
     * relativeLink method.
     * @param {*} $target
     * @param {*} $link
     * @param {*} $force
     * @returns {any}
     */
    relativeLink($target: Record<string, any>, $link: any, $force: boolean = false) {
        let relTarget = path.relative(path.dirname($link), $target);
        return this.link(relTarget, $link, $force);
    }

    /**
     * name method.
     * @param {*} $path
     * @returns {any}
     */
    name($path: string) {
        return path.parse($path).name;
    }

    /**
     * basename method.
     * @param {*} $path
     * @returns {any}
     */
    basename($path: string) {
        return path.basename($path);
    }

    /**
     * dirname method.
     * @param {*} $path
     * @returns {any}
     */
    dirname($path: string) {
        return path.dirname($path);
    }

    /**
     * extension method.
     * @param {*} $path
     * @returns {any}
     */
    extension($path: string) {
        return path.extname($path).replace(/^\./, "");
    }

    /**
     * guessExtension method.
     * @param {*} $path
     * @returns {any}
     */
    guessExtension($path: string) {
        return path.extname($path)
    }

    /**
     * type method.
     * @param {*} $path
     * @returns {any}
     */
    type($path: string) {
        return fs.lstat($path).then(stats => stats.isDirectory() ? "dir" : "file").catch(() => "file");
    }

    /**
     * mimeType method.
     * @param {*} $path
     * @returns {any}
     */
    mimeType($path: string) {
        return path.extname($path).replace(/^\./, "");
    }

    /**
     * size method.
     * @param {*} $path
     * @returns {any}
     */
    size($path: string) {
        return fs.stat($path).then(stats => stats.size);
    }

    /**
     * lastModified method.
     * @param {*} $path
     * @returns {any}
     */
    lastModified($path: string) {
        return fs.stat($path).then(stats => Math.floor(stats.mtimeMs / 1000));
    }

    /**
     * isDirectory method.
     * @param {*} $directory
     * @returns {any}
     */
    isDirectory($directory: any) {
        return fs.lstat($directory).then(stats => stats.isDirectory()).catch(() => false);
    }

    /**
     * isReadable method.
     * @param {*} $path
     * @returns {any}
     */
    isReadable($path: string) {
        return fs.access($path, fs.constants.R_OK).then(() => true).catch(() => false);
    }

    /**
     * isWritable method.
     * @param {*} $path
     * @returns {any}
     */
    isWritable($path: string) {
        return fs.access($path, fs.constants.W_OK).then(() => true).catch(() => false);
    }

    /**
     * isFile method.
     * @param {*} $file
     * @returns {any}
     */
    isFile($file: any) {
        return fs.lstat($file).then(stats => stats.isFile()).catch(err => false);
    }

    /**
     * glob method.
     * @async
     * @param {*} $pattern
     * @returns {any}
     */
    async glob($pattern: string) {
        const dir = path.dirname($pattern);
        const base = path.basename($pattern);
        let globPattern = "*";
        if (base && base !== ".") {
            globPattern = base;
        }
        return Finder.create().path(dir).glob(globPattern).find();
    }

    /**
     * requireOnce method.
     * @param {*} $path
     * @param {*} $data
     * @returns {any}
     */
    requireOnce($path: string, $data: any[] = []) {
        return this.isFile($path).then($exists => {

            if ($exists) {
                return require($path);

            } else {
                throw new FileNotFoundException("File does not exist at path {$path}.");

            }

        })

    }

    /**
     * files method.
     * @param {*} $directory
     * @param {*} $hidden
     * @returns {any}
     */
    files($directory: any, $hidden: boolean = false) {
        let inst = Finder.create().path($directory)
        if ($hidden) {
            inst.ignoreHiddenDirectories()
        }
        return inst.depth(0).find()

    }

    /**
     * allFiles method.
     * @param {*} $directory
     * @param {*} $hidden
     * @returns {any}
     */
    allFiles($directory: any, $hidden: boolean = false) {
        let inst = Finder.create().path($directory)
        if ($hidden) {
            inst.ignoreHiddenDirectories()
        }
        return inst.find()

    }

    /**
     * directories method.
     * @param {*} $directory
     * @returns {any}
     */
    directories($directory: any) {

        return Finder.create().path($directory).directory().depth(1).find()

    }

    /**
     * ensureDirectoryExists method.
     * @param {*} $path
     * @param {*} $mode
     * @param {*} $recursive
     * @returns {any}
     */
    ensureDirectoryExists($path: string, $mode: any = 0o755, $recursive: boolean = true) {
        return fs.ensureDir($path, $mode).then($exists => true).catch(err => false)

    }

    /**
     * makeDirectory method.
     * @param {*} $path
     * @param {*} $mode
     * @param {*} $recursive
     * @param {*} $force
     * @returns {any}
     */
    makeDirectory($path: string, $mode: any = 0o755, $recursive: boolean = false, $force: boolean = false) {
        return fs.mkdir($path, {
            mode: $mode,
            recursive: $recursive
        });

    }

    /**
     * moveDirectory method.
     * @async
     * @param {*} $from
     * @param {*} $to
     * @param {*} $overwrite
     * @returns {any}
     */
    async moveDirectory($from: any, $to: any, $overwrite: boolean = false) {
        if ($overwrite && await this.isDirectory($to) && !await this.deleteDirectory($to)) {
            return false;
        }

        try {
            await fs.rename($from, $to);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * copyDirectory method.
     * @async
     * @param {*} $directory
     * @param {*} $destination
     * @param {*} $options
     * @returns {any}
     */
    async copyDirectory($directory: any, $destination: any, $options: Record<string, any> = {}) {
        if (!await this.isDirectory($directory)) {
            return false;
        }

        await this.ensureDirectoryExists($destination);

        try {
            await fs.copy($directory, $destination, $options);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * deleteDirectory method.
     * @async
     * @param {*} $directory
     * @param {*} $preserve
     * @returns {any}
     */
    async deleteDirectory($directory: any, $preserve: boolean = false) {
        if (!await this.isDirectory($directory)) {
            return false;
        }

        if ($preserve) {
            await fs.emptyDir($directory);
        } else {
            await fs.remove($directory);
        }

        return true;
    }

    /**
     * deleteDirectories method.
     * @async
     * @param {*} $directory
     * @returns {any}
     */
    async deleteDirectories($directory: any) {
        let $allDirectories = await this.directories($directory);

        if ($allDirectories && $allDirectories.length > 0) {
            for (let $directoryName of $allDirectories) {
                await this.deleteDirectory($directoryName);
            }

            return true;
        }

        return false;
    }

    /**
     * cleanDirectory method.
     * @param {*} $directory
     * @returns {any}
     */
    cleanDirectory($directory: any) {
        return this.deleteDirectory($directory, true);
    }
}
module.exports = Filesystem
