const mod = require("../index");

describe("module exports", () => {
  it("will expose functions", () => {
    expect(typeof mod.get).toBe("function");
    expect(typeof mod["=="]).toBe("function");
  });
});
