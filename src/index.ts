// NOTE: Keep these comments in sync with Storage:
// @ts-ignore
const _: Storage = undefined;

class LocalStorageAssertionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'LocalStorageAssertionError';
  }
}

interface LocalKeyParams<T = unknown> {
  /**
   * If true, the `sampleValue` will be used as the default value
   * if the key is not found in localStorage.
   *
   * If false, the `sampleValue` will be ignored.
   * Defaults to false.
   */
  hasDefaultValue?: boolean;

  /**
   * Custom converter to serialize objects stored in the localStorage.
   */
  toStorage?: (value: T) => string;

  /**
   * Custom converter to deserialize objects stored in the localStorage.
   */
  fromStorage?: (value: string) => T;
}

/** T is the type that you store/retrieve from localStorage.
 *
 * Basic usage:
 * ```ts
 * const mykey = new LocalKey("myKey", false);
 * LocalStorage.get(mykey) -> boolean | null
 * LocalStorage.set(mykey, "not a boolean") -> error
 * ```
 * More info: https://www.npmjs.com/package/ts-localstorage
 */
export class LocalKey<T = unknown> {
  public readonly hasDefaultValue: boolean = false;
  public readonly hasCustomConverter: boolean = false;

  constructor(
    /** The key name to be used in the native localStorage. */
    public readonly key: string,

    /**
     * This is necessary to enable runtime checks and conversions.
     * It is not used for anything else unless you enable
     * `hasDefaultValue`
     */
    public readonly sampleValue: T | null,

    /** Additional parameters. */
    params?: LocalKeyParams<T>
  ) {
    assert(typeof sampleValue !== "function", "Serializing functions to localStorage is forbidden since you could only get them back using eval().");

    this.hasDefaultValue = params?.hasDefaultValue ?? this.hasDefaultValue;

    const paramsWithConverter = params as LocalKeyParams<T> | undefined;

    const hasToStorage = paramsWithConverter?.toStorage !== undefined;
    const hasFromStorage = paramsWithConverter?.toStorage !== undefined;
    assert(hasToStorage === hasFromStorage, "Either both or none of toStorage and fromStorage must be defined.");
    if (paramsWithConverter?.toStorage !== undefined) {
      this.toStorage = paramsWithConverter.toStorage;
    }
    if (paramsWithConverter?.fromStorage !== undefined) {
      this.fromStorage = paramsWithConverter.fromStorage;
    }
  }

  public readonly toStorage = (value: T): string => {
    const type = typeof this.sampleValue;

    if (type === "boolean") return (value as unknown as boolean).toString();
    if (type === "number") return (value as unknown as number).toString();
    if (type === "string") return value as unknown as string;

    if (this.sampleValue instanceof String) {
      return (value as unknown as String).toString() as string;
    }

    if (this.sampleValue instanceof Map) {
      return JSON.stringify([...(value as unknown as Map<any, any>)]);
    }

    if (this.sampleValue instanceof Date) {
      return (value as unknown as Date).toISOString();
    }

    // Use stringify() as a last resort.
    return JSON.stringify(value);
  }

  public readonly fromStorage = (value: string): T => {
    const type = typeof this.sampleValue;

    if (type === "boolean") return JSON.parse(value.toLowerCase()) as unknown as T;
    if (type === "number") return parseFloat(value) as unknown as T;
    if (type === "string") return value as unknown as T;

    if (this.sampleValue instanceof Boolean) return new Boolean(value) as unknown as T;
    if (this.sampleValue instanceof Number) return new Number(value) as unknown as T;
    if (this.sampleValue instanceof String) return new String(value) as unknown as T;

    if (this.sampleValue instanceof Map) {
      return new Map(JSON.parse(value)) as unknown as T;
    }

    if (this.sampleValue instanceof Date) {
      return new Date(value) as unknown as T;
    }

    // Use parse() as a last resort.
    return JSON.parse(value);
  }
}

/**
 * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
 *
 * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
 */
function setItem<T>(key: LocalKey<T>, value: T | null | undefined) {
  if (value === null || value === undefined) {
    LocalStorage.removeItem(key);
    return;
  }
  const stringified = key.toStorage(value);
  return localStorage.setItem(key.key, stringified);

}

/**
 * Returns the current value associated with the given key, or null if the given key does not exist in the list associated with the object.
 */
function getItem<T>(key: LocalKey<T>): T | null {
  const result = localStorage.getItem(key.key);
  if (result === null || result === undefined) {
    if (key.hasDefaultValue) return key.sampleValue;
    return null;
  };

  return key.fromStorage(result) as T;
}

/**
 * Removes the key/value pair with the given key from the list associated with the object, if a key/value pair with the given key exists.
 */
function removeItem(key: LocalKey<any>): void {
  return localStorage.removeItem(key.key);
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
function key<T = unknown>(index: number, defaultValue: T): LocalKey<T> | null {
  const key = localStorage.key(index);
  if (key === null) return null;
  return new LocalKey<T>(key, defaultValue);
}

/**
 * Returns the number of key/value pairs currently present in the list associated with the object.
 */
function length(): number {
  return localStorage.length;
}

/**
 * Wrapper around console.assert() that also throws.
 * @param check The assertion that should be true.
 * @param message The error message if the assertion fails.
 */
function assert(check: boolean, message?: string): asserts check {
  console.assert(check, message)
  if (!check) throw new LocalStorageAssertionError(message);
}

export const LocalStorage = { setItem, getItem, removeItem, clear, key, length };
