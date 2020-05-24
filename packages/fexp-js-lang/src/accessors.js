const _get = require("lodash.get");

// Locate a property from the context
const resolveContext = (context, obj, property) => {
  // Access from the supplied object
  if (typeof property === "string" && typeof obj !== "undefined") {
    return _get(obj, property);
  }

  // Access the default argument
  const arg0 =
    context &&
    context.vars &&
    context.vars.arguments &&
    context.vars.arguments[0];
  if (
    typeof property === "string" &&
    typeof arg0 === "object" &&
    context !== null
  ) {
    return _get(arg0, property);
  }

  return null;
};

const get = args => {
  const [prop, obj] = args;
  const { context } = args;

  return resolveContext(context, obj, prop);
};

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
const fnArg = args => {
  const [index] = args;
  const { context } = args;
  return context.vars.arguments[index];
};

module.exports = {
  get,
  at,
  length,
  ["fn-arg"]: fnArg
};
