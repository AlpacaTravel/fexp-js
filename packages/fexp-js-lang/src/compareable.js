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

const eq = args => compare((a, b) => a === b, args);
const lt = args => compare((a, b) => typeof a == typeof b && a < b, args);
const lte = args => compare((a, b) => typeof a == typeof b && a <= b, args);
const gt = args => compare((a, b) => typeof a == typeof b && a > b, args);
const gte = args => compare((a, b) => typeof a == typeof b && a >= b, args);

const deepCompare = args => compare((a, b) => _isEqual(a, b), args);

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
