import { LocalKey, LocalStorage } from ".";

const key1 = "mykey1" as LocalKey<string>;
const key2 = "mykey2" as LocalKey<Date>;

// Be careful, this library does NOT make sure your keys are unique.
const key3 = "mykey1" as LocalKey<string>;

const value1 = LocalStorage.getItem(key1); // => string
const value2 = LocalStorage.getItem(key2); // => Date

LocalStorage.setItem(key1, "newvalue");
LocalStorage.setItem(key1, true); // error, key only allows strings
LocalStorage.setItem(key2, new Date()); // valid, key allows booleans
