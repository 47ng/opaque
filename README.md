# OPAQUE

OPAQUE key exchange for Node.js (CJS) and browsers (ESM) via WebAssembly.

## Packages

- [`@47ng/opaque-client`](https://npmjs.com/package/@47ng/opaque-client) - Browser client (ESM)
- [`@47ng/opaque-server`](https://npmjs.com/package/@47ng/opaque-server) - Node.js server (CJS)

## Code signature

Published packages are signed with [`sceau`](https://github.com/47ng/sceau),
and can be verified with the following public key:

```shell
sceau verify --publicKey 5ac3e4d721755717f07d2af2fc8814c28b8265390d195644ccbf4141a7483564
```

## Versioning

This project does not follow SemVer, but instead follows the Major and Minor
versions of the underlying Rust crate in [`submodules/opaque-wasm`](./submodules/opaque-wasm/).

Patch versions may be upgraded when the need arises, and will not contain
breaking changes.

## License

Dual-licensed Apache-2.0 and MIT.
