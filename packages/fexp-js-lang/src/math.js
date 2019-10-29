const { toNumber } = require("./type");

const numbersOperation = fn => ([a, b]) => fn(toNumber([a]), toNumber([b]));

const subtract = numbersOperation((a, b) => a - b);
const add = numbersOperation((a, b) => a + b);
const divide = numbersOperation((a, b) => a / b);
const multiply = numbersOperation((a, b) => a * b);
const ceil = ([a]) => Math.ceil(toNumber([a]));
const floor = ([a]) => Math.floor(toNumber([a]));
const round = ([arg0]) => Math.round(toNumber([arg0]));
const pow = ([arg0, arg1]) => Math.pow(toNumber([arg0]), toNumber([arg1]));
const sqrt = ([arg0]) => Math.sqrt(toNumber([arg0]));
const abs = ([arg0]) => Math.abs(toNumber([arg0]));
const asin = ([arg0]) => Math.asin(toNumber([arg0]));
const sin = ([arg0]) => Math.sin(toNumber([arg0]));
const acos = ([arg0]) => Math.acos(toNumber([arg0]));
const cos = ([arg0]) => Math.cos(toNumber([arg0]));
const atan = ([arg0]) => Math.atan(toNumber([arg0]));
const tan = ([arg0]) => Math.tan(toNumber([arg0]));
const min = args => Math.min(...args.map(arg => toNumber([arg])));
const max = args => Math.max(...args.map(arg => toNumber([arg])));
const random = () => Math.random();
const e = () => Math.E;
const pi = () => Math.PI;
const ln = ([arg0]) => Math.log(toNumber([arg0]));
const ln2 = () => Math.LN2;
const ln10 = () => Math.LN10;
const log2e = () => Math.LOG2E;
const log10e = () => Math.LOG10E;

module.exports = {
  add,
  "+": add,
  subtract,
  "-": subtract,
  multiply,
  "*": multiply,
  divide,
  "/": divide,
  floor,
  ceil,
  round,
  pow,
  "^": pow,
  sqrt,
  abs,
  sin,
  cos,
  tan,
  asin,
  e,
  ln,
  acos,
  atan,
  min,
  max,
  random,
  pi,
  ln2,
  ln10,
  log2e,
  log10e
};
