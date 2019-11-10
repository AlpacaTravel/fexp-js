const mod = require("../index");

describe("module exports", () => {
  it("will expose functions", () => {
    expect(typeof mod.evaluate).toBe("function");
    expect(typeof mod.compile).toBe("function");
    expect(typeof mod.langs).toBe("function");
  });
  it("will composite langs with langs(...)", () => {
    const lang1 = { fn1: () => true };
    const lang2 = { fn2: () => true };
    const lang = mod.langs(lang1, lang2);
    expect(typeof lang.fn1).toBe("function");
    expect(typeof lang.fn2).toBe("function");
  });
});
