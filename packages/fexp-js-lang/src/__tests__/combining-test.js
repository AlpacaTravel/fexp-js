const combining = require("../combining");

describe("Combing", () => {
  it('will ensure all properties using "all"', () => {
    expect(combining.all([true, true])).toBe(true);
    expect(combining.all([false, true])).toBe(false);
    expect(combining.all([false, false])).toBe(false);
  });
  it('will ensure some properties using "any"', () => {
    expect(combining.any([true, true])).toBe(true);
    expect(combining.any([false, true])).toBe(true);
    expect(combining.any([false, false])).toBe(false);
  });
  it('will ensure none args using "none"', () => {
    expect(combining.none([true, true])).toBe(false);
    expect(combining.none([false, true])).toBe(false);
    expect(combining.none([false, false])).toBe(true);
  });
});
