const mod = require("../index");
const parse = mod.parse;

describe("module exports", () => {
  it("will expose functions", () => {
    expect(typeof mod.langs).toBe("function");
    expect(typeof mod.parse).toBe("function");
    expect(typeof mod.parser).toBe("object");
  });
  it("will composite langs with langs(...)", () => {
    const lang1 = { fn1: () => true };
    const lang2 = { fn2: () => true };
    const lang = mod.langs(lang1, lang2);
    expect(typeof lang.fn1).toBe("function");
    expect(typeof lang.fn2).toBe("function");
  });
  it("will create a parsed context", () => {
    const fn = args => args.get(0) === args.context.vars.arguments[0];
    const lang = { fn };
    const parsed = mod.parse(["fn", 1], lang);
    expect(parsed(1)).toBe(true);
  });
  describe("parse expression basics", () => {
    describe("using functions", () => {
      it("will call supplied functions", () => {
        const expr = ["my-function", "arg1", "arg2"];
        const param = { foo: "bar" };
        const myFunction = jest.fn(args => {
          const [arg1, arg2] = args;
          const { context } = args;
          return `${arg1}${arg2}${context.vars.arguments[0].foo}`;
        });

        const result = parser(expr, { "my-function": myFunction });
        expect(result(param)).toBe("arg1arg2bar");
        expect(myFunction.mock.calls.length).toBe(1);
        expect(myFunction.mock.calls[0][0]).toMatchObject(["arg1", "arg2"]);
        expect(myFunction.mock.calls[0][1]).toMatchObject({
          vars: { arguments: [param] }
        });
      });
      it("will throw when unmatched", () => {
        expect(() => {
          parse(["foo"]);
        }).toThrow();
      });
    });
    describe("using literals", () => {
      it('will no process further ["literal", ["foo", "bar"]]', () => {
        const expr = ["literal", ["foo", "bar"]];
        const result = parse(expr, { foo: () => "substituted" });
        expect(result()).toMatchObject(["foo", "bar"]);
      });
    });
    describe("using evaluate", () => {
      it("will process against the supplied context", () => {
        const param = { foo: { bar: "foobar" } };
        const get = args => context.vars.arguments[0][args.get(0)];

        const result = parse(["evaluate", ["get", "bar"], ["get", "foo"]], {
          get
        });
        expect(result(param)).toBe("foobar");
      });
    });
    describe("using negate", () => {
      it("will negate a literal", () => {
        expect(parse(["!literal", true])()).toBe(false);
        expect(parse(["!literal", false])()).toBe(true);
      });
      it("will negate an evaluate", () => {
        expect(parse(["!evaluate", false])()).toBe(true);
        expect(parse(["!evaluate", true])()).toBe(false);
      });
      it("will negate a fn result", () => {
        const mfn = ([arg0]) => arg0;
        expect(parse(["!mfn", false], { mfn })()).toBe(true);
        expect(parse(["!mfn", true], { mfn })()).toBe(false);
      });
      it("will negate simply", () => {
        expect(parse(["!", true])()).toBe(false);
        expect(parse(["!", false])()).toBe(true);
      });
      it("will throw a non-negateable value", () => {
        expect(() => {
          parse(["!", { foo: "bar" }])();
        }).toThrow();
        expect(() => {
          const mfn = ([arg0]) => arg0;
          parse(["!mfn", { foo: "bar" }], { mfn })();
        }).toThrow();
        expect(() => {
          parse(["!literal", { foo: "bar" }])();
        }).toThrow();
      });
      it("will construct a fn", () => {
        const mfn = args => args.get(0) && args.context.vars.arguments[0];
        const fn1 = parse(["fn", ["mfn", true]], { mfn });
        value(fn1(true)).toBe(true);
        expect(fn1(false)).toBe(false);
        const fn2 = parse(["!fn", ["mfn", true]], { mfn });
        expect(fn2(true)).toBe(false);
        expect(fn2(false)).toBe(true);
      });
      it("will support map with lambda", () => {
        const map = ([arg0, arg1]) => arg0.map(arg1);
        const fnArg = args => args.context.vars.arguments[args.get(0)];
        const mult = ([arg0, arg1]) => arg0 * arg1;
        const lang = { map, ["fn-arg"]: fnArg, ["*"]: mult };
        expect(
          parse(
            ["map", [1, 2, 3], ["fn", ["*", ["fn-arg", 0], ["fn-arg", 0]]]],
            lang
          )()
        ).toMatchObject([1, 4, 9]);
      });
    });
  });
});
