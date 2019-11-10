# fexp-js (Functional Expressions for JS)

![npm](https://img.shields.io/npm/v/@alpaca-travel/fexp-js)[![Build Status](https://travis-ci.org/AlpacaTravel/fexp-js.svg?branch=master)](https://travis-ci.org/AlpacaTravel/fexp-js)[![Coverage Status](https://coveralls.io/repos/github/AlpacaTravel/fexp-js/badge.svg?branch=master)](https://coveralls.io/github/AlpacaTravel/fexp-js?branch=master)![npm bundle size](https://img.shields.io/bundlephobia/minzip/@alpaca-travel/fexp-js?label=core)![npm bundle size](https://img.shields.io/bundlephobia/minzip/@alpaca-travel/fexp-js-lang?label=standard-lang)

Functional Expressions ("fexp") provides a simple functional scripting syntax. fexp-js is a supported JavaScript implementation for developers to offer in their applications.

- Simple syntax :relieved:
- General purpose expressions (filtering, map/reduce etc) :hammer: :wrench:
- Portable via serialization (JSON) :envelope:
- Compiles expressions into functions :speedboat: :rocket:
- Tiny, with a full-featured syntax :school_satchel:
- Or able to support your own set of functions :scissors: :bulb:

Developers can implement fexp into your application environments to offer scripting syntax within their product for other developers. These could be used to describe filter evaluation criteria, or perform various tranformations or map/reduce expressions.

## "fexp" Syntax Overview

`[<name>, [param1[, param2[, ..., paramN]]]]`

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
import { compile } from "@alpaca-travel/fexp-js";
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
const { compiled: fn } = compile(expr, lang);

// Match against our collection
const firstMatch = hotels.find(item => fn(lang, item));

console.log(firstMatch);
```

[![Edit fexp-js-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/fexp-js-demo-vomem?fontsize=14&previewwindow=tests)

# Language Reference

## Standard Language (fexp-js-lang)

- Equality: ==, !=, <, >, <=, >=, eq, lt, lte, gt, gte
- Deep Equality: equal/equals, !equal/!equals
- Accessors: get (also using paths like foo.bar), at, length
- Existence: has/have/exist/exists/empty, !has/!have/!exist/!exists/!empty
- Membership: in/!in
- Types: typeof, to-boolean, to-string, to-number, to-regex, to-date, is-array, is-number, is-boolean, is-object, is-regex
- Regular Expressions: "regex-test"
- Combining: all/any/none
- String manipulation: concat, uppercase, lowercase
- Math: +, -, \*, /, floor, ceil, sin/cos/tan/asin/acos/atan, pow, sqrt, min, max, random, e, pi, ln, ln2, ln10, log2e, log10e
- control: match, case
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
import { evaluate } from "@alpaca-travel/fexp-js";
import lang from "@alpaca-travel/fexp-js-lang";

describe("Using Types with fexp-js-lang", () => {
  it("will return typeof for the supplied parameters", () => {
    // ['typeof', 0] === 'number'
    expect(evaluate(["typeof", 0], lang)).toBe("number");
    expect(evaluate(["typeof", "test"], lang)).toBe("string");
    expect(evaluate(["typeof", { foo: "bar" }], lang)).toBe("object");
    expect(evaluate(["typeof", ["literal", ["value1", "value2"]]], lang)).toBe(
      "object"
    );
  });
  it("will cast using to-boolean", () => {
    expect(evaluate(["to-boolean", "true"], lang)).toBe(true);
    expect(evaluate(["to-boolean", "yes"], lang)).toBe(true);
    expect(evaluate(["to-boolean", "false"], lang)).toBe(false);
    expect(evaluate(["to-boolean", "0"], lang)).toBe(false);
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

## Enhanced Alpaca Language (fexp-js-lang-alpaca)

The enhanced alpaca language is built to support the alpaca platform language with specific enhancements:

- GIS, boolean conditions on geometry, working with FeatureCollections/Features
- Accessing attributes
- Evaluating dates and opening hours

# Developing and Extending

## Installation

`yarn add @alpaca-travel/fexp-js @alpaca-travel/fexp-js-lang`

## API Surface

### compile(expr, lang)

Compiles the expression into a function for repeat use.

```javascript
import { compile } from "@alpaca-travel/fexp-js";
import lang from "@alpaca-travel/fexp-js-lang";

// Simple expression
const expr = ["==", ["get", "foo"], "bar"];

// Compile into function to evaluate
const {
  source, // <-- Source JS
  compiled // <-- Function
} = compile(expr, lang);

// Execute the compiled function against a context
const result = compiled(lang, { foo: "bar" });

console.log(result); // <-- true
```

### evaluate(expr, lang[, context])

Evaluates an expression without use of compilation (so is therefore slower than compiling).

```javascript
import { evaluate } from "@alpaca-travel/fexp-js";
import lang from "@alpaca-travel/fexp-js-lang";

// Simple expression
const expr = ["==", ["get", "foo"], "bar"];

// Execute the compiled function against a context
const result = evaluate(expr, lang, { foo: "bar" });

console.log(result); // <-- true
```

### langs(lang1, [, lang2[, lang3, ..., langN]])

Composites langs together to mix in different function support

```javascript
import { langs } from "@alpaca-travel/fexp-js";

import std from "@alpaca-travel/fexp-js-lang";
import myLib from "./my-lib";

// Composite the languages, mixing yours and the standard lib
const lang = langs(std, myLib);

// Evaluate now with support for multiple
evaluate(["all", ["my-function", "arg1"], ["==", "foo", "foo"]], lang);
```

## Adding Custom Functions

```javascript
import { langs } from "@alpaca-travel/fexp-js";
import std from "@alpaca-travel/fexp-js-lang";

// Implement a sum function to add resolved values
const sum = args => args.reduce((c, t) => c + t);

// Build an expression
const expr = ["sum", 1, 2, 3, 4];

// Add the "sum" function to the standard lang
const lang = langs(std, { sum });

// Compile for execution
const { compiled: exprFn } = compile(expr, lang);

// Process the compiled function
console.log(exprFn(lang));
```

## Embedding in MongoDB

MongoDB offers support for providing a string containing a JavaScript expression in the \$where clause.

#### Template for String expression

Below is a verbose example of creating a string JavaScript expression with a compiled expression and
fexp-js-lang runtime.

If you are creating your own language extensions, you will need to compile your lang additions using
your preferred development environment into a target platform (e.g. rollup build configuration,
see packages/fexp-js-lang/rollup.config.js for example) to provide MongoDB your language implementation.

```javascript
const fs = require("fs");
const path = require("path");
const { compile } = require("@alpaca-travel/fexp-js");
const lang = require("@alpaca-travel/fexp-js-lang");

// Compile your expression with your lang
const { source } = compile(["==", ["get", "foo"], "foobar"], lang);

// Obtian your compiled lang source (example shows the IIFE named export of fexp-js-lang)
const langSource = fs.readFileSync(
  path.resolve(__dirname, "./node_modules/fexp-js-lang/dist/index-inc.js")
);

// Build the MongoDB string JavaScript expression
// Substitute in the 2 compiled components; source and your language source
const expression = `function() {
  // Lang source is named 'lang' (e.g. var lang = ... )
  ${langSource}

  // Our Compiled fn
  const sub = function() {
    ${source}
  }

  return sub(lang, this);
}`;

// Output the expression
console.log(expression);

// Use in MongoDB $where operator
// https://docs.mongodb.com/manual/reference/operator/query/where/
// db.players.find({ $where: expression })
```

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
