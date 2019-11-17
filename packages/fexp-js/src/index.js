const parser = require("./parse");

const langs = (...composites) => {
  return Object.assign({}, ...composites);
};

const parse = function(expr, lang, options) {
  // Parse the expression
  const parsed = parser.parse(expr, lang, options);

  return function() {
    // Build context around the function call
    const context = {
      vars: {
        arguments: [...arguments]
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
  parse,
  parser
};
