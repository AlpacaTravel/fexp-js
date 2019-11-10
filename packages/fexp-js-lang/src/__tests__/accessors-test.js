const accessors = require("../accessors");

describe("Accessors", () => {
  it('will access context properties using "get"', () => {
    expect(
      accessors.get(["foo"], { vars: { arguments: [{ foo: "bar" }] } })
    ).toBe("bar");
    expect(
      accessors.get(["foo.bar"], {
        vars: { arguments: [{ foo: { bar: "foobar" } }] }
      })
    ).toBe("foobar");
    expect(accessors.get(["bar"], null)).toBe(null);
    expect(
      accessors.get(["bar", { bar: "foo" }], {
        vars: { arguments: [{ bar: "bar" }] }
      })
    ).toBe("foo");
  });
  it('will access length using the "length"', () => {
    expect(accessors.length([[1, 2, 3]])).toBe(3);
    expect(accessors.length([null])).toBe(0);
  });
  it('will access values from an array index using "at"', () => {
    expect(accessors.at([2, 1, 2, 3])).toBe(3);
    expect(accessors.at([2, [1, 2, 3]])).toBe(3);
    expect(accessors.at([2, undefined])).toBe(undefined);
  });
});
