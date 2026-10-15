const FilesystemManager = require("../filesystemManager");
const FilesystemServiceProvider = require("../filesystemServiceProvider");
const Filesystem = require("../filesystem");
const path = require("path");

describe("FilesystemManager and ServiceProvider Unit Tests", () => {
    let appMock;
    let manager;
    let configData;

    beforeEach(() => {
        configData = {
            filesystem: {
                default: "local",
                cloud: "s3",
                disks: {
                    local: {
                        driver: "local",
                        root: path.join(__dirname, "tmp_manager_root")
                    },
                    s3: {
                        driver: "s3",
                        key: "key",
                        secret: "secret",
                        bucket: "bucket"
                    },
                    azure: {
                        driver: "azure",
                        account: "account",
                        key: Buffer.from("key").toString("base64"),
                        container: "container"
                    }
                }
            },
            "filesystems.default": "local",
            "filesystems.cloud": "s3"
        };

        appMock = {
            make: (b) => {
                if (b === "config") return configData;
                return null;
            },
            config: configData,
            singleton: jest.fn()
        };
        manager = new FilesystemManager(appMock);
    });

    test("disk() and drive() resolve local driver", () => {
        const localDisk = manager.disk("local");
        expect(localDisk).toBeDefined();

        const driveDisk = manager.drive("local");
        expect(driveDisk).toBe(localDisk);

        // default disk
        const defDisk = manager.disk();
        expect(defDisk).toBe(localDisk);
    });

    test("cloud() resolves configured cloud driver", () => {
        jest.mock("aws-sdk", () => ({
            S3: jest.fn().mockImplementation(() => ({}))
        }), { virtual: true });

        const cloudDisk = manager.cloud();
        expect(cloudDisk).toBeDefined();
    });

    test("createAzureDriver() resolves azure adapter", () => {
        jest.mock("@azure/storage-blob", () => ({
            BlobServiceClient: jest.fn().mockImplementation(() => ({
                getContainerClient: jest.fn()
            })),
            StorageSharedKeyCredential: jest.fn()
        }), { virtual: true });

        const azureDisk = manager.disk("azure");
        expect(azureDisk).toBeDefined();
    });

    test("resolve() throws InvalidArgumentException when disk config not found", () => {
        expect(() => manager.disk("invalid_disk")).toThrow("Disk [invalid_disk] was not available.");
    });

    test("registerToRequest() binds store and storeAs methods", async () => {
        class MockFileRequest {
            constructor() {
                this.hashname = "test.png";
                this.buffer = Buffer.from("image");
            }
            getHashname() {
                return this.hashname;
            }
            getBufferData() {
                return this.buffer;
            }
        }

        manager.registerToRequest(MockFileRequest);
        const req = new MockFileRequest();
        expect(typeof req.store).toBe("function");
        expect(typeof req.storeAs).toBe("function");

        const resStore = await req.store("uploads", "local");
        expect(resStore.message).toBe("File created successfully");

        const resStoreAs = await req.storeAs("uploads", "custom.png", "local");
        expect(resStoreAs.message).toBe("File created successfully");

        // using options as second param
        const resStoreOptions = await req.store("uploads", {});
        expect(resStoreOptions.message).toBe("File created successfully");

        const resStoreAsOptions = await req.storeAs("uploads", "file.png", {});
        expect(resStoreAsOptions.message).toBe("File created successfully");
    });

    test("FilesystemServiceProvider registers services", () => {
        const singletons = {};
        const app = {
            make: (b) => {
                if (b === "config") return configData;
                return null;
            },
            singleton: (name, factory) => {
                singletons[name] = factory;
            },
            config: configData
        };

        const provider = new FilesystemServiceProvider(app);
        provider.register();
        provider.boot();

        expect(singletons["files"]).toBeDefined();
        expect(singletons["files"]()).toBeInstanceOf(Filesystem);

        expect(singletons["filesystem"]).toBeDefined();
        const mgr = singletons["filesystem"](app);
        expect(mgr).toBeInstanceOf(FilesystemManager);

        app["filesystem"] = mgr;
        expect(singletons["filesystem.disk"](app)).toBeDefined();
        expect(singletons["filesystem.cloud"](app)).toBeDefined();
    });
    test("instantiates manager with handler as class and as object", () => {
        class CustomHandlerClass {
            customMethod() {}
        }
        const appWithClassHandler = {
            make: (b) => ({
                filesystem: {
                    default: "local",
                    handler: CustomHandlerClass,
                    disks: { local: { driver: "local", root: "/tmp" } }
                }
            })
        };
        const mgrClass = new FilesystemManager(appWithClassHandler);
        expect(mgrClass).toBeDefined();

        const customObj = { customProp: true };
        const appWithObjHandler = {
            make: (b) => ({
                filesystem: {
                    default: "local",
                    handler: customObj,
                    disks: { local: { driver: "local", root: "/tmp" } }
                }
            })
        };
        const mgrObj = new FilesystemManager(appWithObjHandler);
        expect(mgrObj).toBeDefined();

        class NonObjectClass {
            constructor() { this.prop = 1; }
        }
        const appWithCustomInst = {
            make: (b) => ({
                filesystem: {
                    default: "local",
                    handler: new NonObjectClass(),
                    disks: { local: { driver: "local", root: "/tmp" } }
                }
            })
        };
        const mgrCustomInst = new FilesystemManager(appWithCustomInst);
        expect(mgrCustomInst).toBeDefined();
    });
    test("drive() with null or undefined uses default driver", () => {
        expect(manager.drive()).toBeDefined();
        expect(manager.drive(null)).toBeDefined();
    });

    test("registerToRequest default arguments", async () => {
        class MockFileReq {
            getHashname() { return "hash.jpg"; }
            getBufferData() { return Buffer.from("jpg"); }
        }
        manager.registerToRequest(MockFileReq);
        const req = new MockFileReq();
        const r1 = await req.store();
        expect(r1.type).toBe("file");
        const r2 = await req.storeAs("", "custom.jpg");
        expect(r2.type).toBe("file");
    });

    test("instantiates manager with handler as plain string/number fallback and tests store/storeAs disk string vs object", async () => {
        const appFallback = {
            make: (b) => ({
                filesystem: {
                    default: "local",
                    handler: "invalid_handler_type",
                    disks: { local: { driver: "local", root: "/tmp" } }
                }
            })
        };
        const mgrFallback = new FilesystemManager(appFallback);
        expect(mgrFallback).toBeDefined();

        class MockFileReq {
            getHashname() { return "file.png"; }
            getBufferData() { return Buffer.from("data"); }
        }
        manager.registerToRequest(MockFileReq);
        const req = new MockFileReq();

        // disk passed as string "local", options passed as object { opt: 1 }
        const r1 = await req.store("dir", "local", { opt: 1 });
        expect(r1.type).toBe("file");

        const r2 = await req.storeAs("dir", "named.png", "local", { opt: 2 });
        expect(r2.type).toBe("file");

        const r2NoOpt = await req.storeAs("dir", "named.png", "local");
        expect(r2NoOpt.type).toBe("file");

        const r2AllDefault = await req.storeAs("dir", "def_filename.png");
        expect(r2AllDefault.type).toBe("file");

        const r2DiskEmpty = await req.storeAs("dir", "def_filename.png", "");
        expect(r2DiskEmpty.type).toBe("file");

        const r2DiskEmptyWithOpt = await req.storeAs("dir", "def_filename.png", "", { opt: 5 });
        expect(r2DiskEmptyWithOpt.type).toBe("file");

        // disk passed as object { opt: 3 }, options omitted
        const r3 = await req.store("dir", { opt: 3 });
        expect(r3.type).toBe("file");

        const r4 = await req.storeAs("dir", "named.png", { opt: 4 });
        expect(r4.type).toBe("file");
    });

});
