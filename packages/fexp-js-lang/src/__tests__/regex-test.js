const regex = require("../regex");

describe("Regex", () => {
  it('will check presence of values using "in"', () => {
    expect(regex["regex-test"](["foobar", new RegExp("^foo")])).toBe(true);
    expect(regex["regex-test"](["goobar", new RegExp("^foo")])).toBe(false);
  });
});
