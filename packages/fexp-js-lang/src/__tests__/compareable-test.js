const compareable = require("../compareable");

describe("Combing", () => {
  it('will compare using "eq", "=="', () => {
    expect(compareable.eq([true, true])).toBe(true);
    expect(compareable.eq([false, true])).toBe(false);
    expect(compareable.eq([1, 1])).toBe(true);
    expect(compareable.eq([1, 0])).toBe(false);
    expect(compareable.eq([1, "1"])).toBe(false);
    expect(compareable.eq).toBe(compareable["=="]);
    expect(compareable.eq).toBe(compareable["="]);
  });
  it('will deep compare using "equals", "equal"', () => {
    expect(compareable.equals([true, true])).toBe(true);
    expect(compareable.equals([1, "1"])).toBe(false);
    expect(compareable.equals([{ foo: "bar" }, { foo: "bar" }])).toBe(true);
    expect(compareable.equals).toBe(compareable.equal);
  });
  it('will compare using "lt", "<"', () => {
    expect(compareable.lt([1, 2])).toBe(true);
    expect(compareable.lt([2, 2])).toBe(false);
    expect(compareable.lt([3, 2])).toBe(false);
    expect(compareable.lt).toBe(compareable["<"]);
  });
  it('will compare using "lte", "<="', () => {
    expect(compareable.lte([1, 2])).toBe(true);
    expect(compareable.lte([2, 2])).toBe(true);
    expect(compareable.lte([3, 2])).toBe(false);
    expect(compareable.lte).toBe(compareable["<="]);
  });
  it('will compare using "gt", ">"', () => {
    expect(compareable.gt([1, 2])).toBe(false);
    expect(compareable.gt([2, 2])).toBe(false);
    expect(compareable.gt([3, 2])).toBe(true);
    expect(compareable.gt).toBe(compareable[">"]);
  });
  it('will compare using "gte", >=', () => {
    expect(compareable.gte([1, 2])).toBe(false);
    expect(compareable.gte([2, 2])).toBe(true);
    expect(compareable.gte([3, 2])).toBe(true);
    expect(compareable.gte).toBe(compareable[">="]);
  });
});
