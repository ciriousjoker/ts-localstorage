import { LocalKey, LocalStorage } from "../src";

interface BasicObject {
  someString: string;
  someBoolean: boolean;
}

class ClassInstance implements BasicObject {
  constructor(public someString: string, public someBoolean: boolean) { }

  public get someGetter() { return this.someBoolean; }
  public someFunction() { return this.someString; }
}

describe("setItem, getItem, removeItem", () => {
  test("boolean", async () => {
    const keyBoolean = new LocalKey("keyBoolean", false);

    expect(LocalStorage.getItem(keyBoolean)).toBe(null);

    LocalStorage.setItem(keyBoolean, true);
    expect(LocalStorage.getItem(keyBoolean)).toBe(true);

    LocalStorage.setItem(keyBoolean, false);
    expect(LocalStorage.getItem(keyBoolean)).toBe(false);

    LocalStorage.removeItem(keyBoolean);
    expect(LocalStorage.getItem(keyBoolean)).toBe(null);
  });

  test("Boolean", async () => {
    const keyBoolean = new LocalKey("keyBoolean", new Boolean(false));

    expect(LocalStorage.getItem(keyBoolean)).toBe(null);

    LocalStorage.setItem(keyBoolean, new Boolean(true));
    const value1 = LocalStorage.getItem(keyBoolean);
    expect(value1?.valueOf()).toEqual(true);
    expect(value1 instanceof Boolean).toBe(true);

    LocalStorage.removeItem(keyBoolean);
    expect(LocalStorage.getItem(keyBoolean)).toBe(null);
  });

  test("number", async () => {
    const keyNumber = new LocalKey("keyNumber", 0);

    expect(LocalStorage.getItem(keyNumber)).toBe(null);

    LocalStorage.setItem(keyNumber, 0.1);
    expect(LocalStorage.getItem(keyNumber)).toBe(0.1);

    LocalStorage.setItem(keyNumber, 5);
    expect(LocalStorage.getItem(keyNumber)).toBe(5);

    LocalStorage.removeItem(keyNumber);
    expect(LocalStorage.getItem(keyNumber)).toBe(null);
  });

  test("Number", async () => {
    const keyNumberObject = new LocalKey("keyNumberObject", new Number(0));

    expect(LocalStorage.getItem(keyNumberObject)).toBe(null);

    LocalStorage.setItem(keyNumberObject, new Number(0.1));
    const value1 = LocalStorage.getItem(keyNumberObject);
    expect(value1?.valueOf()).toEqual(0.1);
    expect(value1 instanceof Number).toBe(true);

    LocalStorage.setItem(keyNumberObject, new Number(1.1e+5));
    const value2 = LocalStorage.getItem(keyNumberObject);
    expect(value2?.valueOf()).toEqual(1.1e+5);
    expect(value2 instanceof Number).toBe(true);

    LocalStorage.removeItem(keyNumberObject);
    expect(LocalStorage.getItem(keyNumberObject)).toBe(null);
  });

  test("string", async () => {
    const keyString = new LocalKey("keyString", "");
    expect(LocalStorage.getItem(keyString)).toBe(null);

    LocalStorage.setItem(keyString, "a");
    expect(LocalStorage.getItem(keyString)).toBe("a");

    LocalStorage.setItem(keyString, "b");
    expect(LocalStorage.getItem(keyString)).toBe("b");

    LocalStorage.removeItem(keyString);
    expect(LocalStorage.getItem(keyString)).toBe(null);
  });

  test("String", async () => {
    const keyStringObject = new LocalKey("keyStringObject", new String(""));

    expect(LocalStorage.getItem(keyStringObject)).toBe(null);

    LocalStorage.setItem(keyStringObject, new String("c"));
    const value1 = LocalStorage.getItem(keyStringObject);
    expect(value1?.valueOf()).toEqual("c");
    expect(value1 instanceof String).toBe(true);

    LocalStorage.removeItem(keyStringObject);
    expect(LocalStorage.getItem(keyStringObject)).toBe(null);
  });

  test("Date", async () => {
    const key = new LocalKey("keyDate", new Date());

    expect(LocalStorage.getItem(key)).toBe(null);

    const date = new Date();
    LocalStorage.setItem(key, date);
    expect(LocalStorage.getItem(key)).toEqual(date);

    LocalStorage.removeItem(key);
    expect(LocalStorage.getItem(key)).toBe(null);
  });

  test("Map", async () => {
    const key = new LocalKey("keyMap", new Map<string, number>());

    expect(LocalStorage.getItem(key)).toBe(null);

    const obj = new Map<string, number>();
    obj.set("a", 1);
    obj.set("b", 2);
    LocalStorage.setItem(key, obj);
    expect(LocalStorage.getItem(key)).toEqual(obj);

    LocalStorage.removeItem(key);
    expect(LocalStorage.getItem(key)).toBe(null);
  });

  test("BasicObject", async () => {
    const keyBasicObject = new LocalKey("keyBasicObject", {
      someBoolean: false,
      someString: "some string 1"
    } as BasicObject);

    expect(LocalStorage.getItem(keyBasicObject)).toBe(null);

    const obj: BasicObject = {
      someBoolean: true,
      someString: "some string 2"
    };
    LocalStorage.setItem(keyBasicObject, obj);
    expect(LocalStorage.getItem(keyBasicObject)).toEqual(obj);

    LocalStorage.removeItem(keyBasicObject);
    expect(LocalStorage.getItem(keyBasicObject)).toBe(null);
  });


  test("ClassInstance with custom converter", async () => {
    const keyClassInstance = new LocalKey("keyClassInstance", new ClassInstance("", false), {
      toStorage: (value: ClassInstance): string => {
        return JSON.stringify({
          someString: value.someString,
          someBoolean: value.someBoolean,
        } as BasicObject);
      },
      fromStorage: (value: string): ClassInstance => {
        const parsed = JSON.parse(value) as BasicObject;
        return new ClassInstance(parsed.someString, parsed.someBoolean);
      }
    });

    expect(LocalStorage.getItem(keyClassInstance)).toBe(null);

    const instance = new ClassInstance("b", true);
    LocalStorage.setItem(keyClassInstance, instance);
    const instanceAfter = LocalStorage.getItem(keyClassInstance)!;

    expect(instanceAfter).toEqual(instance);
    expect(instanceAfter.someFunction()).toEqual(instance.someFunction());
    expect(instanceAfter.someGetter).toEqual(instance.someGetter);

    LocalStorage.removeItem(keyClassInstance);
    expect(LocalStorage.getItem(keyClassInstance)).toBe(null);
  });
});

describe("default value", () => {
  test("boolean", async () => {
    const key = new LocalKey("keyBoolean", false, {
      hasDefaultValue: true,
    });

    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);

    LocalStorage.setItem(key, true);
    expect(LocalStorage.getItem(key)).toEqual(true);

    LocalStorage.removeItem(key);
    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);
  });

  test("Boolean", async () => {
    const key = new LocalKey("keyBoolean", new Boolean(false), {
      hasDefaultValue: true,
    });

    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);

    LocalStorage.setItem(key, new Boolean(true));
    expect(LocalStorage.getItem(key)).toEqual(new Boolean(true));

    LocalStorage.removeItem(key);
    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);
  });

  test("number", async () => {
    const key = new LocalKey("keyNumber", 0.1, {
      hasDefaultValue: true,
    });

    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);

    LocalStorage.setItem(key, 5);
    expect(LocalStorage.getItem(key)).toEqual(5);

    LocalStorage.removeItem(key);
    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);
  });

  test("Number", async () => {
    const key = new LocalKey("keyNumberObject", new Number(0.1), {
      hasDefaultValue: true,
    });

    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);

    LocalStorage.setItem(key, new Number(5));
    expect(LocalStorage.getItem(key)).toEqual(new Number(5));

    LocalStorage.removeItem(key);
    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);
  });

  test("string", async () => {
    const key = new LocalKey("keyString", "default string", {
      hasDefaultValue: true,
    });

    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);

    LocalStorage.setItem(key, "new string");
    expect(LocalStorage.getItem(key)).toEqual("new string");

    LocalStorage.removeItem(key);
    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);
  });

  test("String", async () => {
    const key = new LocalKey("keyStringObject", new String("default string"), {
      hasDefaultValue: true,
    });

    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);

    LocalStorage.setItem(key, new String("new string"));
    expect(LocalStorage.getItem(key)).toEqual(new String("new string"));

    LocalStorage.removeItem(key);
    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);
  });

  test("Date", async () => {
    const key = new LocalKey("keyMap", new Date(), { hasDefaultValue: true });

    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);

    const date = new Date();
    LocalStorage.setItem(key, date);
    expect(LocalStorage.getItem(key)).toEqual(date);

    LocalStorage.removeItem(key);
    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);
  });

  test("Map", async () => {
    const defaultMap = new Map<string, number>();
    defaultMap.set("a", 1);
    defaultMap.set("b", 2);
    const key = new LocalKey("keyMap", defaultMap, { hasDefaultValue: true });

    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);

    const obj = new Map<string, number>();
    obj.set("c", 1);
    obj.set("d", 2);
    LocalStorage.setItem(key, obj);
    expect(LocalStorage.getItem(key)).toEqual(obj);

    LocalStorage.removeItem(key);
    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);
  });

  test("BasicObject", async () => {
    const key = new LocalKey("keyBasicObject", {
      someBoolean: true,
      someString: "some string 1",
    } as BasicObject, {
      hasDefaultValue: true,
    });

    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);

    const obj: BasicObject = {
      someBoolean: false,
      someString: "some string 3"
    };
    LocalStorage.setItem(key, obj);
    expect(LocalStorage.getItem(key)).toEqual(obj);

    LocalStorage.removeItem(key);
    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);
  });


  test("ClassInstance with custom converter", async () => {
    const key = new LocalKey("keyClassInstance", new ClassInstance("a", true), {
      toStorage: (value: ClassInstance): string => {
        return JSON.stringify({
          someString: value.someString,
          someBoolean: value.someBoolean,
        } as BasicObject);
      },
      fromStorage: (value: string): ClassInstance => {
        const parsed = JSON.parse(value) as BasicObject;
        return new ClassInstance(parsed.someString, parsed.someBoolean);
      },
      hasDefaultValue: true,
    });

    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);

    const instance = new ClassInstance("b", false);
    LocalStorage.setItem(key, instance);
    const instanceAfter = LocalStorage.getItem(key)!;

    expect(instanceAfter).toEqual(instance);
    expect(instanceAfter.someFunction()).toEqual(instance.someFunction());
    expect(instanceAfter.someGetter).toEqual(instance.someGetter);

    LocalStorage.removeItem(key);
    expect(LocalStorage.getItem(key)).toStrictEqual(key.sampleValue);
  });
});

describe("length, key, clear", () => {
  test("length", async () => {
    LocalStorage.setItem(new LocalKey("key1", ""), "value1");
    LocalStorage.setItem(new LocalKey("key2", ""), "value2");
    LocalStorage.setItem(new LocalKey("key2", ""), "value3");
    expect(LocalStorage.length()).toEqual(2);
  });

  test("key", async () => {
    LocalStorage.setItem(new LocalKey("key1", ""), "value1");
    LocalStorage.setItem(new LocalKey("key2", ""), "value2");
    LocalStorage.setItem(new LocalKey("key2", ""), "value3");

    const test = LocalStorage.key(0, "")!;
    expect(LocalStorage.getItem(test)).toEqual("value1");

    const test2 = LocalStorage.key(2, "");
    expect(test2).toBeNull();
  });

  test("clear", async () => {
    LocalStorage.setItem(new LocalKey("key1", ""), "value1");
    LocalStorage.setItem(new LocalKey("key2", ""), "value2");
    LocalStorage.setItem(new LocalKey("key2", ""), "value3");

    expect(LocalStorage.length()).toEqual(2);
    LocalStorage.clear();
    expect(LocalStorage.length()).toEqual(0);
  });
});

describe("Edge cases", () => {
  test("Throw if storing function", async () => {
    expect(() => new LocalKey<Function>("keyFunction", () => undefined)).toThrow();
  });
  
  test("Storing null or undefined should remove the key instead", async () => {
    const key = new LocalKey<string | null | undefined>("keyString", "");

    LocalStorage.setItem(key, "test");
    LocalStorage.setItem(key, null);
    expect(LocalStorage.getItem(key)).toEqual(null);

    LocalStorage.setItem(key, "test");
    LocalStorage.setItem(key, undefined);
    expect(LocalStorage.getItem(key)).toEqual(null);
  });
});

