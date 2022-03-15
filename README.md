# TS-LocalStorage <sub>[(changelog)](CHANGELOG.md)</sub>

[![npm](https://img.shields.io/npm/l/ts-localstorage.svg)](https://github.com/ciriousjoker/ts-localstorage/blob/main/LICENSE)
![npm](https://ciriousjoker.github.io/ts-localstorage/coverage/badge.svg)

A drop in replacement for `localStorage` to add type safety and improved serialization.

Just replace `localStorage` with `LocalStorage` and create your keys like this:

```typescript
// The sample value is only required to make serialization work properly.
// It is now used for anything else unless you set `hasDefaultValue: true`
const key = new LocalKey("mykey", "");
```

**This package does not make sure your keys are unique.**

## Usage

```typescript
const key = "mykey";
const value = localStorage.getItem(key);
localStorage.setItem(key, "newvalue");
```

can be refactored into:

```typescript
import { LocalStorage } from "ts-localstorage";

const key = new LocalKey("mykey", "");
const value = LocalStorage.getItem(key); // => string
LocalStorage.setItem(key, "newvalue");
```

### Other built-in types

This also works with a couple other types out of the box, most notably `Date`, `Map`.
Check the [supported types](#supported-types) for a complete list.

```typescript
const key = new LocalKey("mykey", new Date());
const value = LocalStorage.getItem(key); // => Date

LocalStorage.setItem(key, "newvalue"); // error, "newvalue" isn't a Date
LocalStorage.setItem(key, new Date());
```

### Simple objects

If you have a simple interface that you want to store and retrieve, declare your key like this:

```typescript
const key = new LocalKey<MyInterface>("mykey", null);
const value = LocalStorage.getItem(key); // => MyInterface
LocalStorage.setItem(key, { ... } as MyInterface);
```

This uses `JSON.stringify()` and `JSON.parse()` under the hood, with all its implications regarding number/Date/Map/etc. conversion.

### Custom Converters

You can use any object instance via custom converters:

```typescript
const key = new LocalKey("mykey", new MyClass(), {
  toStorage: (value: MyClass): string => {
    // return serialized value
  },
  fromStorage: (value: string): MyClass => {
    // parse value into a MyClass instance
  },
});
```

### Default values

The first call to `getItem()` will usually return null because it doesn't have a value yet:

```typescript
const key = new LocalKey("mykey", false);
const value = LocalStorage.getItem(key); // => null
LocalStorage.setItem(key, true);
const value = LocalStorage.getItem(key); // => true
```

You can override this behavior like this:

```typescript
const key = new LocalKey("mykey", false, {
  hasDefaultValue: true,
});
const value = LocalStorage.getItem(key); // => false
LocalStorage.setItem(key, true);
const value = LocalStorage.getItem(key); // => true
```

### Passing null and undefined to setItem()

In the native `localStorage`, passing `null` or `undefined` will store it as `"null"` or `"undefined"`. In my experience, this easily leads to issues that are hard to debug. Therefore, if you pass `null` or `undefined` to `LocalStorage.setItem()`, it will internally call `LocalStorage.removeItem()` instead.

```typescript
const key = new LocalKey<string | null | undefined>("mykey", "");

LocalStorage.setItem(key, "test");
LocalStorage.setItem(key, null);
LocalStorage.getItem(key); // => null

LocalStorage.setItem(key, "test");
LocalStorage.setItem(key, undefined);
LocalStorage.getItem(key); // => null (in order to stay as close to localStorage as possible)
```

## Supported types

- `boolean`
- `Boolean` (will be returned as Boolean)
- `number`
- `Number` (will be returned as Number)
- `string`
- `String` (will be returned as String)
- `Date`
- `Map`
- Basic object literals (converted automatically via `JSON.stringify()` & `JSON.parse()`)
- Custom class instances (requires a [custom converter](#custom-converters))

---

Check out [the tests](src/index.test.ts) for info on edge cases like functions and classes.
