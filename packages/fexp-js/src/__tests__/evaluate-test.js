const evaluate = require("../evaluate");

describe("evaluate()", () => {
  describe("expression basics", () => {
    describe("using functions", () => {
      it("will call supplied functions", () => {
        const expr = ["my-function", "arg1", "arg2"];
        const param = { foo: "bar" };
        const myFunction = jest.fn(
          ([arg1, arg2], context) =>
            `${arg1}${arg2}${context.vars.arguments[0].foo}`
        );

        const result = evaluate(expr, { "my-function": myFunction }, param);
        expect(result).toBe("arg1arg2bar");
        expect(myFunction.mock.calls.length).toBe(1);
        expect(myFunction.mock.calls[0][0]).toMatchObject(["arg1", "arg2"]);
        expect(myFunction.mock.calls[0][1]).toMatchObject({
          vars: { arguments: [param] }
        });
      });
      it("will throw when unmatched", () => {
        expect(() => {
          evaluate(["foo"]);
        }).toThrow();
      });
    });
    describe("using literals", () => {
      it('will no process further ["literal", ["foo", "bar"]]', () => {
        const expr = ["literal", ["foo", "bar"]];
        expect(
          evaluate(expr, {
            foo: () => "substituted"
          })
        ).toMatchObject(["foo", "bar"]);
      });
    });
    describe("using evaluate", () => {
      it("will process against the supplied context", () => {
        const param = { foo: { bar: "foobar" } };
        const get = ([arg0], context) => context.vars.arguments[0][arg0];

        const result = evaluate(
          ["evaluate", ["get", "bar"], ["get", "foo"]],
          { get },
          param
        );
        expect(result).toBe("foobar");
      });
    });
    describe("using negate", () => {
      it("will negate a literal", () => {
        expect(evaluate(["!literal", true])).toBe(false);
        expect(evaluate(["!literal", false])).toBe(true);
      });
      it("will negate an evaluate", () => {
        expect(evaluate(["!evaluate", false])).toBe(true);
        expect(evaluate(["!evaluate", true])).toBe(false);
      });
      it("will negate a fn result", () => {
        const mfn = ([arg0]) => arg0;
        expect(evaluate(["!mfn", false], { mfn })).toBe(true);
        expect(evaluate(["!mfn", true], { mfn })).toBe(false);
      });
      it("will negate simply", () => {
        expect(evaluate(["!", true])).toBe(false);
        expect(evaluate(["!", false])).toBe(true);
      });
      it("will throw a non-negateable value", () => {
        expect(() => {
          evaluate(["!", { foo: "bar" }]);
        }).toThrow();
        expect(() => {
          const mfn = ([arg0]) => arg0;
          evaluate(["!mfn", { foo: "bar" }], { mfn });
        }).toThrow();
        expect(() => {
          evaluate(["!literal", { foo: "bar" }]);
        }).toThrow();
      });
      it("will construct a fn", () => {
        const mfn = ([arg0], context) => arg0 && context.vars.arguments[0];
        const fn1 = evaluate(["fn", ["mfn", true]], { mfn });
        expect(fn1(true)).toBe(true);
        expect(fn1(false)).toBe(false);
        const fn2 = evaluate(["!fn", ["mfn", true]], { mfn });
        expect(fn2(true)).toBe(false);
        expect(fn2(false)).toBe(true);
      });
      it("will support map with lambda", () => {
        const map = ([arg0, arg1]) => arg0.map(arg1);
        const fnArg = ([arg0], context) => context.vars.arguments[arg0];
        const mult = ([arg0, arg1]) => arg0 * arg1;
        const lang = { map, ["fn-arg"]: fnArg, ["*"]: mult };
        expect(
          evaluate(
            ["map", [1, 2, 3], ["fn", ["*", ["fn-arg", 0], ["fn-arg", 0]]]],
            lang
          )
        ).toMatchObject([1, 4, 9]);
      });
    });
  });
});
