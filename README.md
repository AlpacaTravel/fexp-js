# fexp-js (Functional Expressions for JS)

![npm](https://img.shields.io/npm/v/@alpaca-travel/fexp-js)[![Build Status](https://travis-ci.org/AlpacaTravel/fexp-js.svg?branch=master)](https://travis-ci.org/AlpacaTravel/fexp-js)[![Coverage Status](https://coveralls.io/repos/github/AlpacaTravel/fexp-js/badge.svg?branch=master)](https://coveralls.io/github/AlpacaTravel/fexp-js?branch=master)![npm bundle size](https://img.shields.io/bundlephobia/minzip/@alpaca-travel/fexp-js?label=core)

Functional Expressions ("fexp") provides a simple functional scripting syntax. fexp-js is a supported JavaScript implementation for developers to offer in their applications.

- Simple syntax :relieved:
- General purpose expressions (filtering, map/reduce etc) :hammer: :wrench:
- Portable via serialization (JSON) :envelope:
- Compiles expressions into functions :speedboat: :rocket:
- Tiny, with a full-featured syntax :school_satchel:
- Optional libs, for GIS :earth_africa: :earth_americas: :earth_asia:
- Or able to support your own set of functions :scissors: :bulb:

Developers can implement fexp into your application environments to offer scripting syntax within their product for other developers. These could be used to describe filter evaluation criteria, or perform various tranformations or map/reduce expressions.

## Syntax Overview

`[<name>, [arg1[, arg2[, ..., argN]]]]`

fexp processes the syntax and will invoke the required language functions as defined in the supplied lang features.

### Evaluation Order

"fexp" expressions form a tree structure. Params are evaluated using a depth-first approach, evaluating parameters before executing parent functions.

```javascript
// Given the expression:
const expr = ["all", ["is-boolean", true], ["==", "foobar", "foobar"]];

// Order of evaluation, DFS
// 1. Evaluate ["is-boolean", ...]
// 2. Evaluate ["==", ...]
// 3. Evaluate ["all", ...]
```

## Basic Example

The fexp-js library is generic enough in scripting purpose to have a wide range of use cases. It could be used for filtering, other map/reduce functions.

Expressions can be used to filter a collection.

```javascript
import { parse } from "@alpaca-travel/fexp-js";
import lang from "@alpaca-travel/fexp-js-lang";

// Our collection (see hotels.json for example)
import hotels from "./hotels.json";

// Serializable/stringify expressions (not required)
const expr = [
  "all",
  [">=", ["get", "stars-rating"], 3.5],
  ["in", ["get", "tags"], "boutique"]
];

// Compile our expression
const fn = parse(expr, lang);

// Match against our collection
const firstMatch = hotels.find(item => fn(item));

console.log(firstMatch);
```

[![Edit fexp-js-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/fexp-js-demo-vomem?fontsize=14&previewwindow=tests)

# Language Reference

## Language Functions

The following language functions are part of the core expression library. They are used to support some of the runtime functions, such as dealing with literal arrays, negation and functions. You don't need to supply these in your language set for them to be used.

### Literal

To stop processing through params (such as an string array which appears like an expression), use the "literal" function.

```javascript
// Use literal to take the params without evaluating the array contents
const expr = ["in", ["literal", ["foo", "bar"]], "bar"];
```

### Negate (!)

You can negate an expression with either the function prefix of `!fn` or using "!" by itself.

```javascript
const expr = ["!", ["==", "foo", "bar"]]; // Negates the == result
const expr2 = ["!my-function"]; // Negates the result of the function call to "my-function"
```

### Function ("fn")

You can build functions that can be passed as function arguments to other functions (such as map reduce etc)

```javascript
const expr = ["fn", ...]; // Returns a function that can be executed with arguments
```

## Standard Language Library (@alpaca-travel/fexp-js-lang)

![npm bundle size](https://img.shields.io/bundlephobia/minzip/@alpaca-travel/fexp-js-lang?label=standard-lang)

- Equality: ==, !=, <, >, <=, >=, eq, lt, lte, gt, gte
- Deep Equality: equal/equals, !equal/!equals
- Accessors: get (also using paths like foo.bar), at, length, fn-arg
- Existence: has/have/exist/exists/empty, !has/!have/!exist/!exists/!empty
- Membership: in/!in
- Types: typeof, to-boolean, to-string, to-number, to-regex, to-date, is-array, is-number, is-boolean, is-object, is-regex
- Regular Expressions: "regex-test"
- Combining: all/any/none
- String manipulation: concat, uppercase, lowercase
- Math: +, -, \*, /, floor, ceil, sin/cos/tan/asin/acos/atan, pow, sqrt, min, max, random, e, pi, ln, ln2, ln10, log2e, log10e
- control: match, case
- map reduce: map/reduce/filter/find
- more..

### Types

fexp-js-lang supports a number of functions to work with types in expressions.

```
// Obtain the "typeof" of parameter
["typeof", "example"] === "string"
["typeof", true] === "boolean"
["typeof", { foo: "bar" }] === "object"
["typeof", ["literal", ["value1", "value2"]]] === "array"

// Cast the param as boolean
["to-boolean", "yes"] === true
// Check if the param is a boolean
["is-boolean", false] === true

// Cast the param as string
["to-string", true] === "true"
// Check if the param is a string
["is-string", "foo"] === true

// Cast the param as number
["to-number", "10"] === 10
// Check if the param is a number
["is-number", "10"] === false
["is-number", 10] === true

// Cast the param as RegExp
["to-regex", "regex?", "i"] === new RegExp("regex?", "i")
// Check if the param is a RegExp
["is-regex", new RegExp("regex", "i")] === true

// Cast the param as Date
["to-date", "2020-01-01"] === new Date("2020-01-01")
// Check if the param is a Date
["is-date", new Date("2020-01-01")] === true
```

```javascript
import { parse } from "@alpaca-travel/fexp-js";
import lang from "@alpaca-travel/fexp-js-lang";

describe("Using Types with fexp-js-lang", () => {
  it("will return typeof for the supplied parameters", () => {
    // ['typeof', 0] === 'number'
    expect(parse(["typeof", 0], lang)()).toBe("number");
    expect(parse(["typeof", "test"], lang)()).toBe("string");
    expect(parse(["typeof", { foo: "bar" }], lang)()).toBe("object");
    expect(parse(["typeof", ["literal", ["value1", "value2"]]], lang)()).toBe(
      "object"
    );
  });
  it("will cast using to-boolean", () => {
    expect(parse(["to-boolean", "true"], lang)()).toBe(true);
    expect(parse(["to-boolean", "yes"], lang)()).toBe(true);
    expect(parse(["to-boolean", "false"], lang)()).toBe(false);
    expect(parse(["to-boolean", "0"], lang)()).toBe(false);
  });
});
```

[![Edit fexp-js-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/fexp-js-demo-vomem?fontsize=14&module=%2Fsrc%2F__tests__%2Ftypes-test.js&previewwindow=tests)

### Control

```
// Supporting basic if/then/else
["case", true, 1, 2] === 1
["case", false, 1, 2] === 2
["case", false, 1, true, 2, 3] === 2
["case", false, 1, false, 2, 3] === 3

// Match
["match", "target", ["a", "set", "of", "target"], 1, 2] === 1
["match", "foo", ["a", "set", "of", "target"], 1, 2] === 2
["match", "foo", ["a", "set", "of", "target"], 1, ["foo"], 2, 3] === 2
["match", "foo", ["a", "set", "of", "target"], 1, ["bar"], 2, 3] === 3
```

### Map Reduce

Using the "fn" and "fn-arg" operators, you can combine with "map"/"reduce"/"filter".

```
// Map
[
  "map",
  [1, 2, 3], // Collection
  [
    "fn", // Build a map function
    [
      "*",
      ["fn-arg", 0], // item
      ["fn-arg", 1], // index
    ]
  ]
] === [0, 2, 3]

// Reduce
[
  "reduce",
  [1, 2, 3], // Collection
  [
    "fn", // Build a reduce function
    [
      "*",
      ["fn-arg", 0], // carry
      ["fn-arg", 1], // item
    ]
  ],
  2 // initial value
] === 12

// Filter
[
  "filter",
  [1, 2, 3],
  [
    "fn",
    [
      ">=",
      2,
      ["fn-arg", 0]
    ]
  ]
] === [2, 3]

// Find
[
  "find",
  [1, 2, 3],
  [
    "fn",
    [
      "<"
      2,
      ["fn-arg", 0]
    ]
  ]
] === 3
```

## GIS Language Enhancements (@alpaca-travel/fexp-js-lang-gis)

![npm bundle size](https://img.shields.io/bundlephobia/minzip/@alpaca-travel/fexp-js-lang-gis?label=gis-lang)

The optional GIS language enhancements provides language enhancements for working with GIS based scripting requirements.

- Boolean comparisons; geo-within, geo-contains, geo-disjoint, geo-crosses, geo-overlap

# Developing and Extending

## Installation

`yarn add @alpaca-travel/fexp-js @alpaca-travel/fexp-js-lang`

### Optionally installs

`yarn add @alpaca-travel/fexp-js-lang-gis`

## API Surface

### parse(expr, lang[, options])

Evaluates an expression without use of compilation (so is therefore slower than compiling).

```javascript
import { parse } from "@alpaca-travel/fexp-js";
import lang from "@alpaca-travel/fexp-js-lang";

// Simple expression
const expr = ["==", ["get", "foo"], "bar"];

// Prepare function
const fn = parse(expr, lang);

console.log(fn({ foo: "bar" })); // <-- true
```

### langs(lang1, [, lang2[, lang3, ..., langN]])

Composites langs together to mix in different function support

```javascript
import { langs } from "@alpaca-travel/fexp-js";

// Lang modules offered
import std from "@alpaca-travel/fexp-js-lang";
import gis from "@alpaca-travel/fexp-js-lang-gis";

// Custom library with your own modues
import myLib from "./my-lib";

// Composite the languages, mixing standard, gis and custom libs
const lang = langs(std, gis, myLib);

// Evaluate now with support for multiple
evaluate(["all", ["my-function", "arg1"], ["==", "foo", "foo"]], lang);

console.log(result); // <-- true
```

## Adding Custom Functions

```javascript
import { langs, parse } from "@alpaca-travel/fexp-js";
import std from "@alpaca-travel/fexp-js-lang";

// Implement a sum function to add resolved values
const sum = ([...args]) => args.reduce((c, t) => c + t);

// Build an expression
const expr = ["sum", 1, 2, 3, 4];

// Add the "sum" function to the standard lang
const lang = langs(std, { sum });

// Compile for execution
const fn = parse(expr, lang);

// Process the compiled function
console.log(fn()); // <-- 10
```

### Optional Parsing Behaviour

You can customise the parsing behaviour of your functions by supplying your function with a parse implementation.

```javascript
// A trivial function
const myMixedLiteralFunction = ([arg0, arg1]) => arg0.contains(arg1);

// Customise the parse behaviour
myMixedLiteralFunction.parse = (args, parser) => {
  // Treat the first as a literal, and the second as an expression
  return [args[0], parse(args[1])];
};

const parsed = parse(["my-mixed-literal-function", [1, 2, 3], ["get", "foo"]]);

parsed({ foo: 1 });
```

Note: You can also return a new function as a result, if you want to perform an initialisation on the supplied arguments.

### Typechecking (coming soon)

Parsing options can perform typechecking on your expression to evaluate the compatibility of your expressions.

To support typechecking compatibility, you will need to define the argument types and possible return types.

### A note about deferred execution

Arguments are only processed when they are accessed. This is for an optimisation so that when using none/any/all etc it can terminate early, without evaluating the remaining expressions.

### Understanding Function Arguments (args)

You functions are provided with the signature `fn(args)`.

Args provides access to the args of an expression, as well as context vars (aka stack). The args object is an iterator so you can use similar method signatures to peel off arguments.

```javascript
const customFn = args => {
  // Resolved expression args
  const [arg0, arg1] = args;
  // Runtime args
  const { context } = args;

  // Accessing the current context vars
  // These will contain the initial parse(X) arguments supplied to top level
  const {
    vars: { arguments: runtimeArguments }
  } = context;
};
```

When your function is invoked, the special vars of "arguments" is assigned the function arguments. In the case of using expressions (using API compiled or evaluate), they are assigned to vars.

```javascript
const lang = {
  // Capture the context and args
  ['my-function']: (args) => {
    const [arg0, arg1] = args;
    console.log(arg0, arg1); // Prints "farg1", "farg2"
    const { context } = args;
    console.log(context); // Prints { vars: { arguments: ["arg1", "arg2"] } }
}

// Execute to capture
const result = parse(["my-function", "farg1", "farg2"], lang);

result("arg1", "arg2");
```

By executing a function in your expression (e.g. by calling "fn" to create a sub-function), when invoked will contain a new context, and the context vars "arguments" contain the arguments passed to your function. By using "fn-args" (in the standard library), you can access the function arguments by index.

## Contributing

- This package uses lerna
- Builds are done using rollup

### Testing

```shell
$ cd packages/fexp-js
$ yarn && yarn test
```

### Benchmarking

```shell
$ cd packages/fexp-js
$ yarn && yarn build && yarn benchmark
```

### Generating Documentation

```shell
$ docsify init ./docs
$ docsify serve ./docs
```
