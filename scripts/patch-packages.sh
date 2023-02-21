#!/usr/bin/env bash

set -e

version=$1

# Server --

cd $(dirname $0)/..
repoRoot=$(pwd)

echo "[@47ng/opaque-server] Patching in packages/server"
cd $repoRoot/packages/server
# Explicit package type
pnpm pkg set type=commonjs
# Metadata
pnpm pkg set name=@47ng/opaque-server
pnpm pkg set "collaborators[]=François Best <npm.opaque@francoisbest.com>"
pnpm pkg set repository.url=https://github.com/47ng/opaque.git
pnpm pkg set repository.directory=packages/server
pnpm pkg set license="(Apache-2.0 OR MIT)"
pnpm pkg set publishConfig.access=public
if [ -n "$version" ]; then
  echo "[@47ng/opaque-server] Overriding version to $version"
  pnpm pkg set version=$version
else
  echo "[@47ng/opaque-server] Keeping version $(pnpm pkg get version)"
fi
# Override docs
cp -f $repoRoot/docs/server.md README.md
# Code signature using https://github.com/47ng/sceau
pnpm add -D sceau
pnpm pkg set "files[]=sceau.json"
pnpm pkg set scripts.prepack="sceau sign"
rm -f .gitignore
echo "[@47ng/opaque-server] Patched successfully"

# Client --

echo "[@47ng/opaque-client] Patching in packages/client"
cd $repoRoot/packages/client
# Provide Base64-inlined WASM to ease with bundling
echo -n "export const wasmBase64 = '" > inline-wasm.js
echo -n "$(cat opaque-client_bg.wasm | base64)" >> inline-wasm.js
echo "';" >> inline-wasm.js
echo "export const wasmBase64: string" > inline-wasm.d.ts
pnpm pkg set "files[]=inline-wasm.js"
pnpm pkg set "files[]=inline-wasm.d.ts"
# Explicit package type and add ESM exports
pnpm pkg set type=module
pnpm pkg set --json exports="{              \
  \".\":{                                   \
    \"import\":\"./opaque-client.js\",      \
    \"types\":\"./opaque-client.d.ts\"      \
  },                                        \
  \"./inline-wasm\":{                       \
    \"import\":\"./inline-wasm.js\",        \
    \"types\":\"./inline-wasm.d.ts\"        \
  }                                         \
}"
# Metadata
pnpm pkg set name=@47ng/opaque-client
pnpm pkg set "collaborators[]=François Best <npm.opaque@francoisbest.com>"
pnpm pkg set repository.url=https://github.com/47ng/opaque.git
pnpm pkg set repository.directory=packages/client
pnpm pkg set license="(Apache-2.0 OR MIT)"
pnpm pkg set publishConfig.access=public
if [ -n "$version" ]; then
  echo "[@47ng/opaque-client] Overriding version to $version"
  pnpm pkg set version=$version
else
  echo "[@47ng/opaque-client] Keeping version $(pnpm pkg get version)"
fi
# Override docs
cp -f $repoRoot/docs/client.md README.md
# Code signature using https://github.com/47ng/sceau
pnpm add -D sceau
pnpm pkg set "files[]=sceau.json"
pnpm pkg set scripts.prepack="sceau sign"
rm -f .gitignore
echo "[@47ng/opaque-client] Patched successfully"
