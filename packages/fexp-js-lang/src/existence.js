const _isEmpty = require("lodash.isempty");

// Existence
const has = ([val]) => {
  return typeof val !== "undefined";
};
const exists = ([prop]) => {
  return typeof prop !== "undefined" && prop !== null;
};
const empty = ([prop]) => _isEmpty(prop);

module.exports = {
  has,
  exists,
  empty
};
