const parse = require("../parse");

describe("Parse", () => {
  describe("getFunctionName(expr)", () => {
    it("will extract a function name", () => {
      expect(parse.getFunctionName(["fn"])).toBe("fn");
      expect(parse.getFunctionName(["!fn"])).toBe("fn");
    });
  });
  describe("isExpression(expr)", () => {
    it("will validate expressions", () => {
      expect(parse.isExpression(["fn"])).toBe(true);
      expect(parse.isExpression(["fn", 1, 2])).toBe(true);

      expect(parse.isExpression([() => {}])).toBe(false);
      expect(parse.isExpression([])).toBe(false);
      expect(parse.isExpression(false)).toBe(false);
      expect(parse.isExpression(() => {})).toBe(false);
    });
  });
  describe("getFunction(name,lang)", () => {
    it("will return the method", () => {
      const fn = () => {};
      expect(parse.getFunction("fn", { fn })).toBe(fn);
      expect(parse.getFunction("fn", {})).toBeUndefined();
      expect(() => parse.getFunction("fn")).toThrow();
    });
  });
  describe("getParser(lang, opts)", () => {
    it("will create a parser", () => {
      const fn = () => true;
      const lang = { fn };
      const options = {};
      const parser = parse.getParser(lang, options);
      expect(typeof parser).toBe("function");
      expect(parser.lang).toBe(lang);
      expect(parser.options).toBe(options);
    });
  });
  describe("getArgumentsParser()", () => {
    it("will return a default parser that calls the parser for each argument and validates the types", () => {
      const parser = jest.fn();
      const fn = () => {};

      const argumentParser = parse.getArgumentsParser(fn, parser);
      expect(typeof argumentParser).toBe("function");

      // Invoke
      const result = argumentParser([1, 2]);

      expect(parser.mock.calls.length).toBe(2);
      expect(parser.mock.calls[0][0]).toBe(1);
      expect(parser.mock.calls[1][0]).toBe(2);
      expect(result.length).toBe(2);
    });

    it("will defer the parser to control of the function if it implements", () => {
      const parser = jest.fn();
      const fn = () => {};
      fn.parse = (args, p) => {
        const [arg0, arg1] = args;
        return [p(arg0 * 2), p(arg1 * 2)];
      };

      const argumentParser = parse.getArgumentsParser(fn, parser);
      expect(typeof argumentParser).toBe("function");

      // Invoke
      const result = argumentParser([1, 2]);

      expect(parser.mock.calls.length).toBe(2);
      expect(parser.mock.calls[0][0]).toBe(2);
      expect(parser.mock.calls[1][0]).toBe(4);
      expect(result.length).toBe(2);
    });
  });
  describe("composeRuntimeArgumentsContext(parsedArguments, context)", () => {
    it("will supply a generator that invokes the arguments", () => {
      // const arg0 = jest.fn(i => i.foo);
      const arg0 = parse.createRuntimeFunction(i => i.context.foo);
      const arg1 = parse.createRuntimeFunction(() => 2);

      const context = { foo: 1 };

      const runtime = parse.composeRuntimeArgumentsContext(
        [arg0, arg1],
        context
      );

      expect(typeof runtime.get).toBe("function");

      expect(runtime.get(0)).toBe(1);
      expect(runtime.get(1)).toBe(2);

      const [a0, a1] = runtime;
      expect(a0).toBe(1);
      expect(a1).toBe(2);

      expect(runtime.context).toBe(context);
      expect(runtime.arguments()).toMatchObject([1, 2]);

      const runtime2 = runtime.createSubRuntime({ foo: 10 });
      expect(runtime2.get(0)).toBe(10);
    });
  });
  describe("createRuntimeFunction(fn, parsedArguments, negate)", () => {
    it("will execute correctly", () => {
      const fn = ([arg0, arg1]) => arg0 === arg1;
      const args = [
        parse.createRuntimeFunction(args => args.context.foo),
        parse.createRuntimeFunction(args => args.context.bar)
      ];

      expect(
        parse.createRuntimeFunction(fn, args, false)({ foo: true, bar: true })
      ).toBe(true);
      expect(
        parse.createRuntimeFunction(fn, args, true)({ foo: true, bar: true })
      ).toBe(false);
      expect(
        parse.createRuntimeFunction(fn, args, false)({ foo: false, bar: true })
      ).toBe(false);
      expect(
        parse.createRuntimeFunction(fn, args, false)({ foo: false, bar: false })
      ).toBe(true);
      expect(
        parse.createRuntimeFunction(fn, args, true)({ foo: false, bar: false })
      ).toBe(false);
    });
  });
  describe("parse", () => {
    it("will execute functions correctly", () => {
      const fnA = ([a, b]) => a === b;
      const fnB = () => true;
      const fnC = () => true;
      const lang = { "fn-a": fnA, "fn-b": fnB, "fn-c": fnC };

      const expr = ["fn-a", ["fn-b"], ["fn-c"]];
      expect(parse.parse(expr, lang)()).toBe(true);
    });

    it("will execute functions with arguments", () => {
      const fnA = ([a, b]) => a === b;
      const fnB = args => args.context[args.get(0)];
      fnB.parse = args => [args[0]];
      const fnC = () => "bar";
      const lang = { "fn-a": fnA, "fn-b": fnB, "fn-c": fnC };

      const expr = ["fn-a", ["fn-b", "foo"], ["fn-c"]];
      expect(parse.parse(expr, lang)({ foo: "bar" })).toBe(true);

      const expr1 = ["!fn-a", ["fn-b", "foo"], ["fn-c"]];
      expect(parse.parse(expr1, lang)({ foo: "bar" })).toBe(false);
    });

    it("will delay execution", () => {
      const fnA = args => {
        for (arg of args) {
          if (arg === true) {
            return true;
          }
        }
      };
      const fnB = () => true;
      const fnC = () => {
        throw Error("Should not be thrown");
      };
      const lang = { "fn-a": fnA, "fn-b": fnB, "fn-c": fnC };

      const expr = ["fn-a", ["fn-b"], ["fn-c"]];
      expect(parse.parse(expr, lang)()).toBe(true);
    });

    it("will not parse a string value", () => {
      const fnA = ([arg0, arg1]) => arg0 === arg1;
      const lang = { "fn-a": fnA };

      const expr = ["fn-a", "foo", "foo"];
      expect(parse.parse(expr, lang)()).toBe(true);
    });

    it("will not by-parse a custom parse function", () => {
      const fnA = ([arg0, arg1]) => arg0 === arg1;
      fnA.parse = () => ["foo", "foo"];
      const fnB = () => {
        throw new Error("Continued processing");
      };
      const lang = { "fn-a": fnA, "fn-b": fnB };

      const expr = ["fn-a", ["fn-b"], ["fn-b"]];
      expect(parse.parse(expr, lang)()).toBe(true);
    });
  });
});
