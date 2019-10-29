# fexp-js - Functional Expressions in JavaScript

Simple modular expressions described in a portal format (JSON).

## Syntax

The syntax:
`[[!]<name>, [param1[, param2[, ..., paramN]]]]`

## Evaluation

```javascript
import { evaluate } from "fexp-js";

// Expressions are just JSON strings
const expression = JSON.parse(`["==", ["get", "foo"], "bar"]`);

// Evaluate the expression against context
const result = evaluate(expr, { foo: "bar" });
console.log(result); // Output; true
```

## Core functions

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
- more..

## Declaring new functions

```javascript
// My own function
const foobar = ([a, b]) => a * b;

// Example expression with our own function
const expression = JSON.parse(`["foobar", ["get", "foo"], ["get", "bar"]]`);
const result = evaluate(expression, { foo: 2, bar: 3 }, { foobar });
console.log(result); // 6
```
