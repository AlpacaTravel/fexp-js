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
      ["!", ["!all", true, true]],
      ["!literal", false],
      ["literal", true]
    ];
    const fns = {
      "==": ([a, b]) => a === b,
      get: ([arg0], context) => context[arg0],
      all: args => args.every(a => a === true)
    };
    const { source } = compile(expr, fns);
    const fn = new Function(source);
    const result = fn(context, fns);
    expect(result).toBe(true);
  });
});
