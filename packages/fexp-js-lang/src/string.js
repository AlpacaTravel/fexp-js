const type = require("./type");

const toString = type["to-string"];

const concat = args => args.map(toString).reduce((c, t) => c.concat(t), "");
const lowercase = ([prop]) => toString([prop]).toLowerCase();
const uppercase = ([prop]) => toString([prop]).toUpperCase();

module.exports = {
  concat,
  lowercase,
  downcase: lowercase,
  uppercase,
  upcase: uppercase
};
