const evaluate = require("../evaluate");

describe("evaluate()", () => {
  describe("expression basics", () => {
    describe("using functions", () => {
      it("will call supplied functions", () => {
        const expr = ["my-function", "arg1", "arg2"];
        const context = { foo: "bar" };
        const myFunction = jest.fn(
          ([arg1, arg2], context) => `${arg1}${arg2}${context.foo}`
        );

        const result = evaluate(expr, context, { "my-function": myFunction });
        expect(result).toBe("arg1arg2bar");
        expect(myFunction.mock.calls.length).toBe(1);
        expect(myFunction.mock.calls[0][0]).toMatchObject(["arg1", "arg2"]);
        expect(myFunction.mock.calls[0][1]).toBe(context);
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
          evaluate(expr, null, {
            foo: () => "substituted"
          })
        ).toMatchObject(["foo", "bar"]);
      });
    });
    describe("using evaluate", () => {
      it("will process against the supplied context", () => {
        const context = { foo: { bar: "foobar" } };
        const get = ([arg0], context) => context[arg0];

        const result = evaluate(
          ["evaluate", ["get", "bar"], ["get", "foo"]],
          context,
          { get }
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
        const fn = ([arg0]) => arg0;
        expect(evaluate(["!fn", false], null, { fn })).toBe(true);
        expect(evaluate(["!fn", true], null, { fn })).toBe(false);
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
          const fn = ([arg0]) => arg0;
          evaluate(["!fn", { foo: "bar" }], null, { fn });
        }).toThrow();
        expect(() => {
          evaluate(["!literal", { foo: "bar" }]);
        }).toThrow();
      });
    });
  });
});
