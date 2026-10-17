# @ostro/filesystem — Antigravity AI Architecture & Knowledge Base

> **Package Name**: `@ostro/filesystem`
> **Version**: `2.0.0-alpha.1`
> **Role in Ecosystem**: Modular Core Framework Library

---

## 1. Package Purpose & Overview
Unified file abstraction layer supporting Local, S3, Azure, and memory storage backends.

- **Primary Architectural Patterns**: Driver manager pattern, streaming file interfaces, mime-type detection.
- **Key Exported Entities**: `FilesystemManager`, `FilesystemAdapter`, `LocalAdapter`, `S3Adapter`, `AzureAdapter`

---

## 2. Dependencies & Interoperability
- **Direct Dependencies**:
  - `@ostro/support`: `^1.0.11`
  - `@ostro/contracts`: `^1.0.2`
  - `fs-extra`: `^10.0.0`
  - `lodash.get`: `^4.4.2`
  - `filehound`: `^1.17.4`
  - `uuid`: `^8.3.2`
- **Framework Consumers**: Consumed across the OstroJS ecosystem via `@ostro/framework` and direct imports.

---

## 3. Directory & Source Layout
```text
origin/filesystem/
├── adapter/CoreAdapter.ts
├── adapter/azure.ts
├── adapter/local.ts
├── adapter/s3.ts
├── callbackHandler.ts
├── clients/azure.ts
├── clients/s3.ts
├── directoryCreateException.ts
├── fileDeleteException.ts
├── fileNotFoundException.ts
├── fileUploadException.ts
├── filesystem.ts
├── filesystemAdapter.ts
├── filesystemManager.ts
├── filesystemServiceProvider.ts
├── invalidArgumentException.ts
```

---

## 4. TypeScript Typing & Code Standards
1. **Access Modifiers**: All class properties and methods declare explicit visibility (`public`, `protected`, `private`).
2. **Inheritance & Overrides**: Classes overriding base class methods use the `override` keyword to safeguard contracts.
3. **Immutability**: Constant lookup tables and static registries use `readonly` and strict record types.
4. **No Implicit Any**: Public APIs avoid `any` in favor of generics (`<T = unknown>`) and typed contracts from `@ostro/contracts`.
5. **Contract Binding**: Core managers implement contracts from `@ostro/contracts/filesystem/*`.

---

## 5. Development & Verification Guide
- **Compile / Build**: `npm run build` (runs `npx tsc -p tsconfig.build.json`)
- **Run Tests**: `npm test` (executes Jest with 100% coverage target via `c8`)
- **Published Artifacts**: Target output compiled to `./build` with accompanying `.d.ts` declarations and source maps.

---
*Generated for Antigravity AI high-speed codebase comprehension with minimal token consumption.*
