const type = require("../type");

describe("Type", () => {
  it('will locate the first string using "string"', () => {
    expect(type.string([null, false, "foo", 1])).toBe("foo");
  });
  it('will locate the first number using "number"', () => {
    expect(type.number([null, false, "foo", 1])).toBe(1);
  });
  it('will locate the first object using "object"', () => {
    expect(type.object([null, false, "foo", 1])).toBe(null);
  });
  it('will locate the first boolean using "boolean"', () => {
    expect(type.boolean([null, false, "foo", 1])).toBe(false);
  });
  it('will locate the first array using "array"', () => {
    expect(type.array([null, false, "foo", 1, [1, 1]])).toMatchObject([1, 1]);
  });
  it('will check string with "is-string"', () => {
    expect(type["is-string"](["string"])).toBe(true);
    expect(type["is-string"]([1])).toBe(false);
  });
  it('will check number with "is-number"', () => {
    expect(type["is-number"](["string"])).toBe(false);
    expect(type["is-number"]([1])).toBe(true);
  });
  it('will check number with "is-object"', () => {
    expect(type["is-object"](["string"])).toBe(false);
    expect(type["is-object"]([1])).toBe(false);
    expect(type["is-object"]([null])).toBe(false);
    expect(type["is-object"]([{ foo: "bar" }])).toBe(true);
    expect(type["is-object"]([[1, 1]])).toBe(false);
  });
  it('will check array with "is-array"', () => {
    expect(type["is-array"](["string"])).toBe(false);
    expect(type["is-array"]([1])).toBe(false);
    expect(type["is-array"]([null])).toBe(false);
    expect(type["is-array"]([{ foo: "bar" }])).toBe(false);
    expect(type["is-array"]([[1, 1]])).toBe(true);
  });
  it('will check boolean with "is-boolean"', () => {
    expect(type["is-boolean"]([true])).toBe(true);
    expect(type["is-boolean"]([false])).toBe(true);
    expect(type["is-boolean"]([1])).toBe(false);
  });
  it("will return the type using typeof", () => {
    expect(type["typeof"]([true])).toBe("boolean");
    expect(type["typeof"]([null])).toBe("null");
    expect(type["typeof"]([[1, 1]])).toBe("array");
    expect(type["typeof"]([{ foo: "bar" }])).toBe("object");
    expect(type["typeof"](["foo"])).toBe("string");
  });
  it('will typecast numbers using, "to-number"', () => {
    expect(type["to-number"](["1"])).toBe(1);
  });
  it('will typecast date using, "to-date"', () => {
    expect(type["to-date"](["1983-08-19"]).getTime()).toBe(
      new Date("1983-08-19").getTime()
    );
  });
  it('will typecast boolean using, "to-boolean"', () => {
    expect(type["to-boolean"]([true])).toBe(true);
    expect(type["to-boolean"]([false])).toBe(false);
    expect(type["to-boolean"]([1])).toBe(true);
    expect(type["to-boolean"]([0])).toBe(false);
    expect(type["to-boolean"](["0"])).toBe(false);
    expect(type["to-boolean"](["1"])).toBe(true);
    expect(type["to-boolean"](["nO"])).toBe(false);
    expect(type["to-boolean"](["yEs"])).toBe(true);
    expect(type["to-boolean"](["falsE"])).toBe(false);
    expect(type["to-boolean"](["truE"])).toBe(true);
  });
  it('will typecast string using "to-string"', () => {
    expect(type["to-string"]([true])).toBe("true");
    expect(type["to-string"]([false])).toBe("false");
    expect(type["to-string"]([null])).toBe("");
    expect(type["to-string"]([1])).toBe("1");
  });
  it('will typecast string using "to-regex"', () => {
    expect(type["to-regex"](["^foo", "i"]).test("FOO")).toBe(true);
    expect(type["to-regex"](["^foo"]).test("foo")).toBe(true);
    expect(type["to-regex"](["^foO"]).test("foo")).toBe(false);
  });
});
