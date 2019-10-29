const _isEqual = require("lodash.isequal");

const compare = (comparison, [valueA, valueB]) => {
  return comparison(compareable(valueA), compareable(valueB));
};

const compareable = value => {
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return value.getTime();
  }

  return value;
};

const eq = (args, context) => compare((a, b) => a === b, args, context);
const lt = (args, context) =>
  compare((a, b) => typeof a == typeof b && a < b, args, context);
const lte = (args, context) =>
  compare((a, b) => typeof a == typeof b && a <= b, args, context);
const gt = (args, context) =>
  compare((a, b) => typeof a == typeof b && a > b, args, context);
const gte = (args, context) =>
  compare((a, b) => typeof a == typeof b && a >= b, args, context);

const deepCompare = (args, context) =>
  compare((a, b) => _isEqual(a, b), args, context);

module.exports = {
  equals: deepCompare,
  equal: deepCompare,
  eq,
  ["=="]: eq,
  ["="]: eq,
  lt,
  ["<"]: lt,
  lte,
  ["<="]: lte,
  gt,
  [">"]: gt,
  gte,
  [">="]: gte
};
