const parser = require("./parse");

const langs = (...composites) => {
  return Object.assign({}, ...composites);
};

const compile = (expr, lang) => {
  return { compiled: parse(expr, lang) };
};

const evaluate = (expr, lang, ...args) => parse(expr, lang)(...args);

const parse = function(expr, lang, options) {
  // Parse the expression
  const parsed = parser.parse(expr, lang, options);

  return function(...args) {
    // Build context around the function call
    const context = {
      vars: {
        arguments: [...args]
      }
    };

    // If we have a value
    if (typeof parsed === "function") {
      return parsed(context);
    }

    // If we did not evaluate a function
    return parsed;
  };
};

module.exports = {
  langs,
  evaluate,
  compile,
  parse,
  parser
};
