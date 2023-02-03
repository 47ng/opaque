Client and server packages can be built using the `pnpm all` command
at the root of the repository.

They are built artifacts and therefore not versioned.

The [`publish.yml`](../.github/workflows/publish.yml) GitHub actions workflow
listens for published Releases, and generates those packages before publishing
them to NPM.
