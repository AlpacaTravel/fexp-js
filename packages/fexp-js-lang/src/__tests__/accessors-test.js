const accessors = require("../accessors");

describe("Accessors", () => {
  it('will access context properties using "get"', () => {
    expect(accessors.get(["foo"], { foo: "bar" })).toBe("bar");
    expect(accessors.get(["foo.bar"], { foo: { bar: "foobar" } })).toBe(
      "foobar"
    );
  });
  it('will access length using the "length"', () => {
    expect(accessors.length([[1, 2, 3]])).toBe(3);
  });
  it('will access values from an array index using "at"', () => {
    expect(accessors.at([2, [1, 2, 3]])).toBe(3);
  });
});
