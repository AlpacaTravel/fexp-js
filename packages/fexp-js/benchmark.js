/* benchmark.js */
const b = require("benny");
const functions = require("../fexp-js-lang/dist/index");
const mod = require("./dist/index");

const factory = () => ({
  tags: ["example", "other"],
  id: Math.random(0, 100),
  collection: [
    {
      id: "field",
      value: true
    }
  ]
});

const expr = [
  "all",
  ["<", ["get", "id"], 10],
  ["in", ["get", "tags"], "example"],
  ["evaluate", ["==", "value", true], ["get", "collection[0]"]]
];
const { source } = mod.compile(expr, functions);
const compiled = new Function(source);

b.suite(
  "fexp-js evaluate",

  b.add("Exeecute Evalute", () => {
    mod.evaluate(expr, factory(), functions);
  }),

  b.add("Execute Pre-compiled Evaluate", () => {
    compiled(factory(), functions);
  }),

  b.cycle(),
  b.complete()
);
