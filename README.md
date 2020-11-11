```sh
npm install ts-localstorage
```

Drop-in replacement for localStorage.
Just replace `localStorage` with `LocalStorage` and mark your keys like this:

```typescript
// YourType will be converted to & from json, so make sure that works.
const key = "mykey" as LocalKey<YourType>;
```

**This pacakge does not make sure your keys are unique.**

## Example

```typescript
const key = "mykey";
const value = localStorage.getItem(key);

localStorage.setItem(key, "newvalue");
```

can be refactored into:

```typescript
import { LocalStorage } from "ts-localstorage";

const key = "mykey" as LocalKey<string>;
const value = LocalStorage.getItem(key); // => string

LocalStorage.setItem(key, "newvalue");
```

## Other types

This package internally uses JSON.parse() & JSON.stringify().

You can use any type compatible with that:

```typescript
const key = "mykey" as LocalKey<Date>;
const value = LocalStorage.getItem(key); // Date

LocalStorage.setItem(key, "newvalue"); // error, "newvalue" isn't a Date
LocalStorage.setItem(key, new Date());
```

Check out the [example](example.ts) to see more info, like error messages.
