const string = require("../string");

describe("String", () => {
  it('will concatenate values using "concat"', () => {
    expect(string.concat(["a", "b", "c"])).toBe("abc");
  });
  it('will lowercase values using "lowercase", "downcase"', () => {
    expect(string.lowercase(["ExamplE"])).toBe("example");
    expect(string.downcase(["ExamplE"])).toBe("example");
  });
  it('will uppercase values using "uppercase", "upcase"', () => {
    expect(string.uppercase(["ExamplE"])).toBe("EXAMPLE");
    expect(string.upcase(["ExamplE"])).toBe("EXAMPLE");
  });
});
