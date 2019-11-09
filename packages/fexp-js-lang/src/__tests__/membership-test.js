const membership = require("../membership");

describe("Membership", () => {
  it('will check presence of values using "in"', () => {
    expect(membership.in([["foo", "bar"], "foo"])).toBe(true);
    expect(membership.in([["goo", "bar"], "foo"])).toBe(false);
    expect(membership.in(["foo", "foo", "bar"])).toBe(true);
    expect(membership.in(["foo", "goo", "bar"])).toBe(false);
  });
});
