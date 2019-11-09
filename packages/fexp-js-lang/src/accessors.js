const _get = require("lodash.get");

// Locate a property from the context
const resolveContext = (context, property) => {
  if (
    typeof property === "string" &&
    typeof context === "object" &&
    context !== null
  ) {
    return _get(context, property);
  }

  return null;
};

const get = ([prop], context) => resolveContext(context, prop);
const length = ([value]) => {
  if (value && value.length) {
    return value.length;
  }
  return 0;
};
const at = args => {
  const [index, ...value] = args;
  if (Array.isArray(value) && value.length > 1) {
    return value[index];
  }
  if (Array.isArray(value[0])) {
    return value[0][index];
  }
  return undefined;
};

module.exports = {
  get,
  at,
  length
};
