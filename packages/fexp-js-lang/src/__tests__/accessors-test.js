const accessors = require("../accessors");

describe("Accessors", () => {
  it('will access context properties using "get"', () => {
    const args1 = ["foo"];
    args1.context = { vars: { arguments: [{ foo: "bar" }] } };
    expect(accessors.get(args1)).toBe("bar");

    const args2 = ["foo.bar"];
    args2.context = { vars: { arguments: [{ foo: { bar: "foobar" } }] } };
    expect(accessors.get(args2)).toBe("foobar");

    expect(accessors.get(["bar"], null)).toBe(null);

    const args3 = ["bar", { bar: "foo" }];
    args3.context = { vars: { arguments: [{ bar: "bar" }] } };
    expect(accessors.get(args3)).toBe("foo");
  });
  it('will access length using the "length"', () => {
    expect(accessors.length([[1, 2, 3]])).toBe(3);
    expect(accessors.length([null])).toBe(0);
  });
  it('will access first using the "first"', () => {
    expect(accessors.first([[1, 2, 3]])).toBe(1);
    expect(accessors.first([null])).toBe(undefined);
  });
  it('will access last using the "last"', () => {
    expect(accessors.last([[1, 2, 3]])).toBe(3);
    expect(accessors.last([null])).toBe(undefined);
  });
  it('will access values from an array index using "at"', () => {
    expect(accessors.at([2, 1, 2, 3])).toBe(3);
    expect(accessors.at([2, [1, 2, 3]])).toBe(3);
    expect(accessors.at([2, undefined])).toBe(undefined);
  });
  it('will access context arguments using "fn-arg"', () => {
    const args1 = [1];
    args1.context = { vars: { arguments: ["foo", "bar"] } };
    expect(accessors["fn-arg"](args1)).toBe("bar");
  });
});
