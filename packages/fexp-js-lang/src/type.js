const string = args => args.find(arg => typeof arg === "string");
const number = args => args.find(arg => typeof arg === "number");
const object = args => args.find(arg => typeof arg === "object");
const boolean = args => args.find(arg => typeof arg === "boolean");
const array = args => args.find(arg => Array.isArray(arg));
const isString = ([arg0]) => typeof arg0 === "string";
const isNumber = ([arg0]) => typeof arg0 === "number";
const isObject = ([arg0]) =>
  typeof arg0 === "object" && arg0 !== null && !Array.isArray(arg0);
const isArray = ([arg0]) => Array.isArray(arg0);
const isBoolean = ([arg0]) => typeof arg0 === "boolean";
const fTypeof = ([arg0]) => {
  const type = typeof arg0;
  if (type === "object") {
    if (Array.isArray(arg0)) {
      return "array";
    }
    if (arg0 === null) {
      return "null";
    }
  }
  // TODO: Check for regex and date

  return type;
};
const toNumber = ([prop]) => Number(prop);
const toDate = ([prop]) => new Date(prop);
const toBoolean = args => {
  const [prop] = args;
  if (typeof prop === "boolean") {
    return prop;
  }
  if (typeof prop === "string") {
    const val = prop.toLowerCase();
    if (val === "1" || val === "true" || val === "yes") {
      return true;
    }
  }
  if (typeof prop === "number") {
    return prop === 1;
  }
  return false;
};
const toString = args => {
  const [prop] = args;
  if (prop === null) {
    return "";
  }
  if (typeof prop === "boolean") {
    if (prop === true) {
      return "true";
    }
    return "false";
  }
  return String(prop);
};
const toRegex = args => {
  const [regex, flags = undefined] = args;
  if (flags) {
    return new RegExp(regex, flags);
  }
  return new RegExp(regex);
};

module.exports = {
  string,
  number,
  boolean,
  object,
  array,
  typeof: fTypeof,
  ["to-number"]: toNumber,
  ["to-boolean"]: toBoolean,
  ["to-string"]: toString,
  ["to-regex"]: toRegex,
  ["to-date"]: toDate,
  ["is-array"]: isArray,
  ["is-boolean"]: isBoolean,
  ["is-number"]: isNumber,
  ["is-string"]: isString,
  ["is-object"]: isObject
};
