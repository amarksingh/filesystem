import type { IFilesystem } from '@ostro/contracts/filesystem/filesystem';
import FilesystemContract from '@ostro/contracts/filesystem/filesystem';
import fs from 'fs-extra';
import Finder from 'filehound';
import path from 'path';
import FileNotFoundException from './fileNotFoundException';
import FileDeleteException from './fileDeleteException';
import FileUploadException from './fileUploadException';
import DirectoryCreateException from './directoryCreateException';

/**
 * Class Filesystem.
 */
class Filesystem extends FilesystemContract implements IFilesystem {

    /**
     * exists method.
     *
     * @param $path - File path to check.
     * @returns Promise resolving to boolean.
     */
    exists($path: string): Promise<boolean> {
        return fs.access($path).then(() => true).catch(() => Promise.resolve(false));
    }

    /**
     * missing method.
     *
     * @param $path - File path to check.
     * @returns Promise resolving to boolean.
     */
    async missing($path: string): Promise<boolean> {
        return !(await this.exists($path));
    }

    /**
     * get method.
     *
     * @param $path - File path to read.
     * @returns Promise resolving to file content string.
     */
    get($path: string): Promise<string> {
        return fs.readFile($path, 'utf8').catch(() => {
            throw new FileNotFoundException(`File does not exist at path ${$path}.`);
        });
    }

    /**
     * put method.
     *
     * @param $path - File path to write.
     * @param $contents - Contents to write.
     * @returns Promise resolving on completion.
     */
    put($path: string, $contents: any): Promise<void> {
        return fs.writeFile($path, $contents);
    }

    /**
     * replaceInFile method.
     *
     * @param $search - Search string or RegExp.
     * @param $replace - Replacement string.
     * @param $path - File path.
     * @returns Promise resolving on completion.
     */
    replaceInFile($search: any, $replace: any, $path: string): Promise<void> {
        return this.get($path).then(content => this.put($path, content.replace($search, $replace)));
    }

    /**
     * prepend method.
     *
     * @param $path - File path.
     * @param $data - Data to prepend.
     * @returns Promise resolving on completion.
     */
    async prepend($path: string, $data: any): Promise<void> {
        if (await this.exists($path)) {
            const existing = await this.get($path);
            return this.put($path, $data + existing);
        }
        return this.put($path, $data);
    }

    /**
     * append method.
     *
     * @param $path - File path.
     * @param $data - Data to append.
     * @returns Promise resolving on completion.
     */
    append($path: string, $data: any): Promise<void> {
        return fs.appendFile($path, $data);
    }

    /**
     * chmod method.
     *
     * @param $path - File path.
     * @param $mode - Mode number.
     * @returns Promise resolving to mode or void.
     */
    chmod($path: string, $mode: any = null): Promise<any> {
        if ($mode) {
            return fs.chmod($path, $mode);
        }
        return fs.stat($path).then(stat => {
            return stat.mode;
        });
    }

    /**
     * delete method.
     *
     * @param $paths - Path or array of paths to delete.
     * @returns Promise resolving to boolean success.
     */
    async delete($paths: any): Promise<boolean> {
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
     *
     * @param $path - Source path.
     * @param $target - Destination path.
     * @returns Promise resolving on completion.
     */
    move($path: string, $target: any): Promise<void> {
        return fs.move($path, $target);
    }

    /**
     * copy method.
     *
     * @param $path - Source path.
     * @param $target - Destination path.
     * @returns Promise resolving on completion.
     */
    copy($path: string, $target: any): Promise<void> {
        return fs.copy($path, $target);
    }

    /**
     * link method.
     *
     * @param $target - Target path.
     * @param $link - Symlink path.
     * @param $force - Force flag.
     * @returns Promise resolving on completion.
     */
    link($target: any, $link: any, $force: boolean = false): Promise<void> {
        return fs.symlink($target, $link, 'junction');
    }

    /**
     * relativeLink method.
     *
     * @param $target - Target path.
     * @param $link - Symlink path.
     * @param $force - Force flag.
     * @returns Promise resolving on completion.
     */
    relativeLink($target: any, $link: any, $force: boolean = false): Promise<void> {
        let relTarget = path.relative(path.dirname($link), $target);
        return this.link(relTarget, $link, $force);
    }

    /**
     * name method.
     *
     * @param $path - File path.
     * @returns File name without extension.
     */
    name($path: string): string {
        return path.parse($path).name;
    }

    /**
     * basename method.
     *
     * @param $path - File path.
     * @returns Base filename with extension.
     */
    basename($path: string): string {
        return path.basename($path);
    }

    /**
     * dirname method.
     *
     * @param $path - File path.
     * @returns Directory path.
     */
    dirname($path: string): string {
        return path.dirname($path);
    }

    /**
     * extension method.
     *
     * @param $path - File path.
     * @returns File extension without leading dot.
     */
    extension($path: string): string {
        return path.extname($path).replace(/^\./, '');
    }

    /**
     * guessExtension method.
     *
     * @param $path - File path.
     * @returns Extension with dot.
     */
    guessExtension($path: string): string {
        return path.extname($path);
    }

    /**
     * type method.
     *
     * @param $path - Path to check.
     * @returns 'dir' or 'file'.
     */
    type($path: string): Promise<string> {
        return fs.lstat($path).then(stats => stats.isDirectory() ? 'dir' : 'file').catch(() => 'file');
    }

    /**
     * mimeType method.
     *
     * @param $path - File path.
     * @returns Extension as mime identifier.
     */
    mimeType($path: string): string {
        return path.extname($path).replace(/^\./, '');
    }

    /**
     * size method.
     *
     * @param $path - File path.
     * @returns Size in bytes.
     */
    size($path: string): Promise<number> {
        return fs.stat($path).then(stats => stats.size);
    }

    /**
     * lastModified method.
     *
     * @param $path - File path.
     * @returns Last modified timestamp in seconds.
     */
    lastModified($path: string): Promise<number> {
        return fs.stat($path).then(stats => Math.floor(stats.mtimeMs / 1000));
    }

    /**
     * isDirectory method.
     *
     * @param $directory - Directory path.
     * @returns Boolean indicating if directory.
     */
    isDirectory($directory: any): Promise<boolean> {
        return fs.lstat($directory).then(stats => stats.isDirectory()).catch(() => false);
    }

    /**
     * isReadable method.
     *
     * @param $path - Path to check.
     * @returns Boolean indicating if readable.
     */
    isReadable($path: string): Promise<boolean> {
        return fs.access($path, fs.constants.R_OK).then(() => true).catch(() => false);
    }

    /**
     * isWritable method.
     *
     * @param $path - Path to check.
     * @returns Boolean indicating if writable.
     */
    isWritable($path: string): Promise<boolean> {
        return fs.access($path, fs.constants.W_OK).then(() => true).catch(() => false);
    }

    /**
     * isFile method.
     *
     * @param $file - Path to check.
     * @returns Boolean indicating if regular file.
     */
    isFile($file: any): Promise<boolean> {
        return fs.lstat($file).then(stats => stats.isFile()).catch(() => false);
    }

    /**
     * glob method.
     *
     * @param $pattern - Pattern to match.
     * @returns Matching file paths.
     */
    async glob($pattern: string): Promise<string[]> {
        const dir = path.dirname($pattern);
        const base = path.basename($pattern);
        let globPattern = '*';
        if (base && base !== '.') {
            globPattern = base;
        }
        return Finder.create().path(dir).glob(globPattern).find();
    }

    /**
     * requireOnce method.
     *
     * @param $path - Module path to require.
     * @param $data - Additional data.
     * @returns Required module export.
     */
    requireOnce($path: string, $data: any[] = []): Promise<any> {
        return this.isFile($path).then($exists => {
            if ($exists) {
                return require($path);
            } else {
                throw new FileNotFoundException("File does not exist at path {$path}.");
            }
        });
    }

    /**
     * files method.
     *
     * @param $directory - Directory path.
     * @param $hidden - Whether to ignore hidden.
     * @returns List of file paths.
     */
    files($directory: any, $hidden: boolean = false): Promise<string[]> {
        let inst = Finder.create().path($directory);
        if ($hidden) {
            inst.ignoreHiddenDirectories();
        }
        return inst.depth(0).find();
    }

    /**
     * allFiles method.
     *
     * @param $directory - Directory path.
     * @param $hidden - Whether to ignore hidden.
     * @returns List of all recursive file paths.
     */
    allFiles($directory: any, $hidden: boolean = false): Promise<string[]> {
        let inst = Finder.create().path($directory);
        if ($hidden) {
            inst.ignoreHiddenDirectories();
        }
        return inst.find();
    }

    /**
     * directories method.
     *
     * @param $directory - Directory path.
     * @returns List of directories.
     */
    directories($directory: any): Promise<string[]> {
        return Finder.create().path($directory).directory().depth(1).find();
    }

    /**
     * ensureDirectoryExists method.
     *
     * @param $path - Directory path.
     * @param $mode - Directory mode permissions.
     * @param $recursive - Recursive creation flag.
     * @returns Boolean success.
     */
    ensureDirectoryExists($path: string, $mode: any = 0o755, $recursive: boolean = true): Promise<boolean> {
        return fs.ensureDir($path, $mode).then(() => true).catch(() => false);
    }

    /**
     * makeDirectory method.
     *
     * @param $path - Directory path.
     * @param $mode - Permissions mode.
     * @param $recursive - Recursive flag.
     * @param $force - Force flag.
     * @returns Result of mkdir.
     */
    makeDirectory($path: string, $mode: any = 0o755, $recursive: boolean = false, $force: boolean = false): Promise<any> {
        return fs.mkdir($path, {
            mode: $mode,
            recursive: $recursive
        });
    }

    /**
     * moveDirectory method.
     *
     * @param $from - Source directory.
     * @param $to - Destination directory.
     * @param $overwrite - Overwrite flag.
     * @returns Boolean success.
     */
    async moveDirectory($from: any, $to: any, $overwrite: boolean = false): Promise<boolean> {
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
     *
     * @param $directory - Source directory.
     * @param $destination - Destination directory.
     * @param $options - Copy options.
     * @returns Boolean success.
     */
    async copyDirectory($directory: any, $destination: any, $options: Record<string, any> = {}): Promise<boolean> {
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
     *
     * @param $directory - Directory path.
     * @param $preserve - Preserve directory flag.
     * @returns Boolean success.
     */
    async deleteDirectory($directory: any, $preserve: boolean = false): Promise<boolean> {
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
     *
     * @param $directory - Directory path.
     * @returns Boolean success.
     */
    async deleteDirectories($directory: any): Promise<boolean> {
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
     *
     * @param $directory - Directory path.
     * @returns Boolean success.
     */
    cleanDirectory($directory: any): Promise<boolean> {
        return this.deleteDirectory($directory, true);
    }
}

export = Filesystem;
