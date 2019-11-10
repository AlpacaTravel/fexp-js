const evaluate = require("./evaluate");
const compile = require("./compile");

const langs = (...composites) => {
  return Object.assign({}, ...composites);
};

module.exports = { evaluate, compile, langs };
