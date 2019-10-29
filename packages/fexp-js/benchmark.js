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
const { compiled } = mod.compile(expr, functions);

b.suite(
  "fexp-js evaluate",

  b.add("Exeecute Evalute", () => {
    mod.evaluate(expr, functions, factory());
  }),

  b.add("Execute Pre-compiled Evaluate", () => {
    compiled(functions, factory());
  }),

  b.cycle(),
  b.complete()
);
