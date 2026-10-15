const FilesystemContract = require('@ostro/contracts/filesystem/filesystem')
const fs = require('fs-extra')
const Finder = require('filehound')
const path = require('path')
const FileNotFoundException = require('./fileNotFoundException')
const FileDeleteException = require('./fileDeleteException')
const FileUploadException = require('./fileUploadException')
const DirectoryCreateException = require('./directoryCreateException')
class Filesystem extends FilesystemContract {

    exists($path) {
        return fs.access($path).then(res => true).catch(err => Promise.resolve(false));
    }

    async missing($path) {
        return !(await this.exists($path));
    }

    get($path) {
        return fs.readFile($path, 'utf8').catch(err => {
            throw new FileNotFoundException(`File does not exist at path ${$path}.`);
        })

    }

    put($path, $contents) {
        return fs.writeFile($path, $contents);
    }

    replaceInFile($search, $replace, $path) {
        return this.get($path).then(content => this.put($path, content.replace($search, $replace)));
    }

    async prepend($path, $data) {
        if (await this.exists($path)) {
            const existing = await this.get($path);
            return this.put($path, $data + existing);
        }
        return this.put($path, $data);
    }

    append($path, $data) {
        return fs.appendFile($path, $data);
    }

    chmod($path, $mode = null) {
        if ($mode) {
            return fs.chmod($path, $mode);
        }
        return fs.stat($path).then(stat => {
            return stat.mode
        });

    }

    async delete($paths) {
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

    move($path, $target) {
        return fs.move($path, $target);
    }

    copy($path, $target) {
        return fs.copy($path, $target);
    }

    link($target, $link, $force = false) {
        return fs.symlink($target, $link, 'junction')
    }

    relativeLink($target, $link, $force = false) {
        let relTarget = path.relative(path.dirname($link), $target);
        return this.link(relTarget, $link, $force);
    }

    name($path) {
        return path.parse($path).name;
    }

    basename($path) {
        return path.basename($path);
    }

    dirname($path) {
        return path.dirname($path);
    }

    extension($path) {
        return path.extname($path).replace(/^\./, "");
    }

    guessExtension($path) {
        return path.extname($path)
    }

    type($path) {
        return fs.lstat($path).then(stats => stats.isDirectory() ? "dir" : "file").catch(() => "file");
    }

    mimeType($path) {
        return path.extname($path).replace(/^\./, "");
    }

    size($path) {
        return fs.stat($path).then(stats => stats.size);
    }

    lastModified($path) {
        return fs.stat($path).then(stats => Math.floor(stats.mtimeMs / 1000));
    }

    isDirectory($directory) {
        return fs.lstat($directory).then(stats => stats.isDirectory()).catch(() => false);
    }

    isReadable($path) {
        return fs.access($path, fs.constants.R_OK).then(() => true).catch(() => false);
    }

    isWritable($path) {
        return fs.access($path, fs.constants.W_OK).then(() => true).catch(() => false);
    }

    isFile($file) {
        return fs.lstat($file).then(stats => stats.isFile()).catch(err => false);
    }

    async glob($pattern) {
        const dir = path.dirname($pattern);
        const base = path.basename($pattern);
        let globPattern = "*";
        if (base && base !== ".") {
            globPattern = base;
        }
        return Finder.create().path(dir).glob(globPattern).find();
    }

    requireOnce($path, $data = []) {
        return this.isFile($path).then($exists => {

            if ($exists) {
                return require($path);

            } else {
                throw new FileNotFoundException("File does not exist at path {$path}.");

            }

        })

    }

    files($directory, $hidden = false) {
        let inst = Finder.create().path($directory)
        if ($hidden) {
            inst.ignoreHiddenDirectories()
        }
        return inst.depth(0).find()

    }

    allFiles($directory, $hidden = false) {
        let inst = Finder.create().path($directory)
        if ($hidden) {
            inst.ignoreHiddenDirectories()
        }
        return inst.find()

    }

    directories($directory) {

        return Finder.create().path($directory).directory().depth(1).find()

    }

    ensureDirectoryExists($path, $mode = 0o755, $recursive = true) {
        return fs.ensureDir($path, $mode).then($exists => true).catch(err => false)

    }

    makeDirectory($path, $mode = 0o755, $recursive = false, $force = false) {
        return fs.mkdir($path, {
            mode: $mode,
            recursive: $recursive
        });

    }

    async moveDirectory($from, $to, $overwrite = false) {
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

    async copyDirectory($directory, $destination, $options = {}) {
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

    async deleteDirectory($directory, $preserve = false) {
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

    async deleteDirectories($directory) {
        let $allDirectories = await this.directories($directory);

        if ($allDirectories && $allDirectories.length > 0) {
            for (let $directoryName of $allDirectories) {
                await this.deleteDirectory($directoryName);
            }

            return true;
        }

        return false;
    }

    cleanDirectory($directory) {
        return this.deleteDirectory($directory, true);
    }
}
module.exports = Filesystem
