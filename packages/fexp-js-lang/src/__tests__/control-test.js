const control = require("../control");

describe("control", () => {
  it("case", () => {
    expect(control.case([true, "1", "2"])).toBe("1");
    expect(control.case([false, "1", "2"])).toBe("2");
    expect(control.case([false, "1", true, "2", "3"])).toBe("2");
    expect(control.case([false, "1", false, "2", "3"])).toBe("3");
  });
  it("match", () => {
    expect(control.match(["target", ["target"], "1", "2"])).toBe("1");
    expect(control.match(["target", ["foo", "bar"], "1", "2"])).toBe("2");
    expect(control.match(["target", "target", "1", "2"])).toBe("1");
    expect(control.match(["target", "targets", "1", "2"])).toBe("2");

    expect(
      control.match(["target", ["target"], "1", ["target2"], "2", "3"])
    ).toBe("1");
    expect(
      control.match(["target", ["foo", "bar"], "1", ["target"], "2", "3"])
    ).toBe("2");
    expect(
      control.match(["target", ["foo", "bar"], "1", ["foo", "bar"], "2", "3"])
    ).toBe("3");
    expect(control.match(["target", "target", "1", "foo", "2", "3"])).toBe("1");
    expect(control.match(["target", "foo", "1", "target", "2", "3"])).toBe("2");
    expect(control.match(["target", "foo", "1", "targets", "2", "3"])).toBe(
      "3"
    );
  });
});
