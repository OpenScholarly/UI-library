# Publishing UI Components Package to GitHub Packages

1) Create classic token with read and write packages permission in GitHub.
2) `npm login --registry=https://npm.pkg.github.com --scope=@OpenScholarly`
3) Create a .npmrc:
  ```json
  @OpenScholarly:registry=https://npm.pkg.github.com
  //npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE
  ```
4) Build and publish:
```bash
npm run build:lib
cd dist/ui-components
npm publish --registry=https://npm.pkg.github.com/@OpenScholarly
# or npm version patch for versioning before publishing.
```