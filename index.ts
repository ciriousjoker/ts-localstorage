/** T is the type that you store/retrieve from localstorage.
 *
 * Usage:
 * 
 * const mykey = "mykey" as LocalKey\<boolean\>;
 * 
 * LocalStorage.get(mykey) -> boolean
 * 
 * LocalStorage.set(mykey, "not a boolean") -> error
 */
export type LocalKey<T> = TypeGuard<T> & string;

export const LocalStorage = { setItem, getItem, removeItem, clear, key, length };

// NOTE: Keep these comments in sync with Storage:
const _: Storage = undefined;

/**
 * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
 *
 * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
 */
function setItem<T>(key: LocalKey<T>, value: T) {
  return localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Returns the current value associated with the given key, or null if the given key does not exist in the list associated with the object.
 */
function getItem<T>(key: LocalKey<T>): T | null {
  return JSON.parse(localStorage.getItem(key)) as T;
}

/**
 * Removes the key/value pair with the given key from the list associated with the object, if a key/value pair with the given key exists.
 */
function removeItem(key: LocalKey<any>): void {
  return localStorage.removeItem(key);
}

/**
 * Empties the list associated with the object of all key/value pairs, if there are any.
 */
function clear(): void {
  return localStorage.clear();
}

/**
 * Returns the name of the nth key in the list, or null if n is greater than or equal to the number of key/value pairs in the object.
 */
function key<T = unknown>(index: number): LocalKey<T> | null {
  return localStorage.key(index) as LocalKey<T>;
}

/**
 * Returns the number of key/value pairs currently present in the list associated with the object.
 */
function length(): number {
  return localStorage.length;
}

class TypeGuard<T> {
  // @ts-ignore
  private as: T;
}
