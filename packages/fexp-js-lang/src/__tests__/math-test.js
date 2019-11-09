const math = require("../math");

describe("Math", () => {
  it('will perform basic arithmetic using "add", "subtract", "divide", "multiply"', () => {
    expect(math.subtract([5, 3])).toBe(2);
    expect(math.add([5, 3])).toBe(8);
    expect(math.multiply([5, 3])).toBe(15);
    expect(math.divide([10, 5])).toBe(2);
    expect(math["*"]).toBe(math.multiply);
    expect(math["/"]).toBe(math.divide);
    expect(math["+"]).toBe(math.add);
    expect(math["-"]).toBe(math.subtract);
  });
  it("will perform various math calls", () => {
    expect(typeof math.random()).toBe("number");
    expect(typeof math.e()).toBe("number");
    expect(typeof math.pi()).toBe("number");
    expect(typeof math.ln([2])).toBe("number");
    expect(typeof math.ln2()).toBe("number");
    expect(typeof math.ln10()).toBe("number");
    expect(typeof math.log2e()).toBe("number");
    expect(typeof math.log10e()).toBe("number");
  });
  it('will offer min/max behaviour with "min" and "max"', () => {
    expect(math.min([1, 2, 3, 4])).toBe(1);
    expect(math.min([[1, 2, 3, 4]])).toBe(1);
    expect(math.min([])).toBe(0);
    expect(math.max([1, 2, 3, 4])).toBe(4);
    expect(math.max([[1, 2, 3, 4]])).toBe(4);
    expect(math.max([])).toBe(0);
  });
  it("will provide sin/tan/cos/asin/atan/cos", () => {
    expect(typeof math.asin([1])).toBe("number");
    expect(typeof math.atan([1])).toBe("number");
    expect(typeof math.acos([1])).toBe("number");
    expect(typeof math.tan([1])).toBe("number");
    expect(typeof math.sin([1])).toBe("number");
    expect(typeof math.cos([1])).toBe("number");
  });
  it("will provide pow/sqrt/abs/ciel/floor", () => {
    expect(math.pow([2, 2])).toBe(4);
    expect(math.sqrt([4])).toBe(2);
    expect(math.floor([4.2])).toBe(4);
    expect(math.ceil([4.2])).toBe(5);
    expect(math.abs([4.2])).toBe(4.2);
    expect(math.abs([-4.2])).toBe(4.2);
  });
});
