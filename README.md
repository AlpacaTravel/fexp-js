# fexp-js - Functional Expressions in JavaScript

Simple modular expressions described in a portable format (JSON).

## Syntax

`[<name>, [param1[, param2[, ..., paramN]]]]`

The syntax will execute against supplied lang features.

## Installation

`yarn add @alpaca-travel/fexp-js @alpaca-travel/fexp-js-lang`

## Basic Usage

```javascript
import { compile } from "@alpaca-travel/fexp-js";
import lang from "@alpaca-travel/fexp-js-lang";

// A large collection
const hotels = [
  {
    id: "123",
    tags: ["boutqiue", "hotel"],
    rating: 4
    // ...
  }
  // ...
];

// Serializable/stringify expressions
const expr = JSON.parse(
  `["all", [">=", ["get", "rating"], 3.5], ["in", ["get", "tags"], "boutique"]]`
);

// Compile the expression
const { compiled: filter, source } = compile(expr, lang);
console.log(source); // Compiled javascript

// Evaluate the expression criteria
const matching = hotels.filter(hotel => filter(lang, hotel));
```

## API

### compile(expr, lang)

Compiles the expression into a function.

### evaluate(expr, lang[, context])

Evaluates an expression.

## Lang Features

The lang package offers a wide functional set for you to leverage, including:

- Equality: ==, !=, <, >, <=, >=
- Context: get
- Deep Equality: equal/equals, !equal/!equals
- Existence: has/have/exist/exists/empty, !has/!have/!exist/!exists/!empty
- Membership: in/!in
- Types: typeof, to-boolean, to-string, to-number, to-regex
- Regular Expressions: "regex-test"
- Combining: all/any/none
- String manipulation: concat, uppercase, lowercase
- Math: +, -, \*, /, floor, ceil
- Control flow: case
- more..

### Your own functions

You can supply your own additional functions

```javascript
// Implement a sum function to add resolved values
const sum = args => args.reduce((c, t) => c + t);

// Build an expression
const expr = ["sum", 1, 2, 3, 4];

// Add the "sum" function to the standard lang
const myLang = { ...lang, sum };

// Compile for execution
const { compiled: filter } = compile(expr, myLang);

console.log(filter(null, myLang));
```

### Using in MongoDB \$where conditions

MongoDB offers support for providing a string containing a JavaScript expression in the \$where clause.

#### Template for String expression

Below is a verbose example of creating a string JavaScript expression with a compiled expression and
fexp-js-lang runtime.

If you are creating your own language extensions, you will need to compile your lang additions using
your preferred development environment into a target platform (e.g. rollup build configuration,
see packages/fexp-js-lang/rollup.config.js for example) to provide MongoDB your language implementation.

```javascript
const { compile } = require("@alpaca-travel/fexp-js");
const lang = require("@alpaca-travel/fexp-js-lang");
const fs = require("fs");
const path = require("path");

// Compiled string of your lang (example shows the IIFE named export of fexp-js-lang)
const langSource = fs.readFileSync(
  path.resolve(__dirname, "./node_modules/fexp-js-lang/dist/index-inc.js")
);

// Compile your expression with your lang
const { source } = compile(["==", ["get", "foo"], "foobar"], lang);

// Build the MongoDB string JavaScript expression
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
```

## Develop

- This package uses lerna
- Builds are done using rollup

### Testing Packages

```shell
$ cd packages/fexp-js
$ yarn && yarn test
```

### Benchmarking

```shell
$ cd packages/fexp-js
$ yarn && yarn build && yarn benchmark
```
