const mod = require("../index");

describe("module exports", () => {
  it("will expose functions", () => {
    expect(typeof mod.evaluate).toBe("function");
    expect(typeof mod.compile).toBe("function");
  });
});
