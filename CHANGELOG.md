## [3.1.0] - 2023-12-20

- `getItem()` now returns non-nullable type if used with a `LocalKey` that has `useDefaultValue: true` #5

## [3.0.0] - 2023-05-31

- Improve tree shaking with webpack (https://webpack.js.org/guides/tree-shaking/)
- Improved internal project structure

**BREAKING:**

- This package is now a pure ESM package. You can no longer use `require()` to import it.

## [2.0.0] - 2022-03-15

- Feature: custom converters
- Feature: default values
- Bugfixes: cleaned up lots of edge cases
- Add tests
- Deploy via CI
- Add coverage & license badges

**BREAKING:**

- Use `new LocalKey("smth", 1337)` instead of `"smth" as LocalKey<number>`
- LocalStorage.key() now requires a sample value as its second parameter
- Trying to store functions will now throw an error, although you shouldn't have done that to begin with

## [1.0.3] - 2020-11-11

- Add `README.md`

## [1.0.0] - 2020-11-11

- Initial release.
