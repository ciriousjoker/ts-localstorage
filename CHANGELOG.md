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
