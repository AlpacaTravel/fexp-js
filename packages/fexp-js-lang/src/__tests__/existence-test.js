const existence = require("../existence");

describe("Existence", () => {
  it('will check properties using "has"', () => {
    expect(existence.has(["foo"])).toBe(true);
    expect(existence.has([undefined])).toBe(false);
    expect(existence.has([null])).toBe(true);
  });
  it('will check elements exist using "exists"', () => {
    expect(existence.exists(["foo"])).toBe(true);
    expect(existence.exists([undefined])).toBe(false);
    expect(existence.exists([null])).toBe(false);
  });
  it('will check empty values using "empty"', () => {
    expect(existence.empty([null])).toBe(true);
    expect(existence.empty([[]])).toBe(true);
  });
});
