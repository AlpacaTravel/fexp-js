const compile = require("../compile");

describe("compile()", () => {
  it("compiles", () => {
    const context = {
      foo: {
        bar: "foobar"
      }
    };

    const expr = [
      "all",
      ["!", false],
      [
        "==",
        ["evaluate", ["get", "bar"], ["literal", { bar: "foobar" }]],
        ["evaluate", ["get", "bar"], ["get", "foo"]],
        "foobar"
      ],
      ["!evaluate", false],
      ["custom"],
      ["!", ["!all", true, true]],
      ["!literal", false],
      ["literal", true]
    ];
    const fns = {
      "==": ([a, b]) => a === b,
      get: ([arg0], context) => context.vars.arguments[0][arg0],
      all: args => args.every(a => a === true),
      custom: () => true
    };
    const { source, compiled } = compile(expr, fns);
    const fn = new Function(source);
    const result = fn(fns, context);
    expect(result).toBe(true);
    expect(typeof compiled).toBe("function");
    expect(compiled(fns, context)).toBe(true);
  });
  it("complains if fn is not found in lang", () => {
    expect(() => compile(["not-found"], {})).toThrow();
  });
  it("compiles fn constructors", () => {
    const mfn = ([arg0], context) => arg0 && context.vars.arguments[0];
    const { compiled: fn1, source } = compile(["fn", ["mfn", true]], { mfn });
    expect(fn1({ mfn })(true)).toBe(true);
    expect(fn1({ mfn })(false)).toBe(false);
    const { compiled: fn2 } = compile(["!fn", ["mfn", true]], { mfn });
    expect(fn2({ mfn })(true)).toBe(false);
    expect(fn2({ mfn })(false)).toBe(true);
  });
  it("will support map with lambda", () => {
    const map = ([arg0, arg1]) => arg0.map(arg1);
    const fnArg = ([arg0], context) => context.vars.arguments[arg0];
    const mult = ([arg0, arg1]) => arg0 * arg1;
    const lang = { map, ["fn-arg"]: fnArg, ["*"]: mult };
    const { compiled: fn } = compile(
      ["map", [1, 2, 3], ["fn", ["*", ["fn-arg", 0], ["fn-arg", 0]]]],
      lang
    );
    expect(fn(lang)).toMatchObject([1, 4, 9]);
  });
});
