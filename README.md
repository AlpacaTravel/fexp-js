# Getting Started

Functional Expressions ("fexp") provides a simple functional scripting syntax. fexp-js is a supported JavaScript implementation for developers to leverage in their applications.

Fexp offers:

- Simple syntax
- General purpose expressions for filtering, map/reduce etc
- Portable via serialization (JSON)
- Expandable with your own functions

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

<iframe
  src="https://codesandbox.io/embed/fexp-js-demo-vomem?expanddevtools=1&fontsize=14&module=%2Fsrc%2Findex.js&previewwindow=tests&view=editor"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="fexp-js-demo-vomem"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

# Language Reference

## Standard Language (fexp-js-lang)

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

<iframe
  src="https://codesandbox.io/embed/fexp-js-demo-vomem?fontsize=14&module=%2Fsrc%2F__tests__%2Ftypes-test.js&previewwindow=tests&view=editor"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="fexp-js-demo-vomem"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

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

### evaluate(expr, lang[, context])

Evaluates an expression without use of compilation (so is therefore slower than compiling)

## Adding Custom Language Support

```javascript
// Implement a sum function to add resolved values
const sum = args => args.reduce((c, t) => c + t);

// Build an expression
const expr = ["sum", 1, 2, 3, 4];

// Add the "sum" function to the standard lang
const myLang = { ...lang, sum };

// Compile for execution
const { compiled: exprFn } = compile(expr, myLang);

// Process the compiled function
console.log(exprFn(myLang));
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
