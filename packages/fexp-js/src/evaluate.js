// Negate the value..
const negate = value => {
  if (typeof value !== "boolean") {
    throw new Error("Can not negate a non boolean value");
  }
  return !value;
};

// No-op on Arg0
const nOpArg0 = ([arg0]) => arg0;

/**
 * Evaluates a supplied expression using the context and supplied functions
 * @param {array} expr The expression to process
 * @param {object} lang Supplied named functions
 */
const evaluate = (expression, lang, ...callArgs) => {
  // Process subroutine
  const run = (expr, context) => {
    // Only evaluate ["name", ...args]
    if (Array.isArray(expr) && typeof expr[0] === "string") {
      let [type, ...args] = expr;

      // Support negating
      let isNegating = type.substr(0, 1) === "!";
      if (isNegating) {
        type = type.substr(1);
      }

      // Literal (don't pass the value further)
      if (type === "literal") {
        // Check for negate conditions
        return isNegating ? negate(args[0]) : args[0];
      }

      // Constructing a function to invoke
      if (type === "fn") {
        return function() {
          const result = run(args[0], {
            vars: { arguments: arguments },
            prior: context
          });
          return isNegating ? negate(result) : result;
        };
      }

      // Evaluate
      if (type === "evaluate") {
        // Determine the new context
        const [next, ...contextArgs] = args;

        // Invoke
        const result = run(next, {
          vars: { arguments: contextArgs.map(arg => run(arg, context)) },
          prior: context
        });

        // Check for negate conditions
        return isNegating ? negate(result) : result;
      }

      // Process
      const fn = type.length === 0 ? nOpArg0 : lang && lang[type];
      if (typeof fn === "function") {
        // Resolve the args (dps)
        const resolvedArgs = args.map(arg => run(arg, context));

        // Invoke
        const result = fn(resolvedArgs, context);
        return isNegating ? negate(result) : result;
      }

      // Throw an exception if no prior conditions are matched
      throw new Error(`Unmatched function: ${type}`);
    }

    return expr;
  };

  return run(expression, { vars: { arguments: callArgs }, calling: null });
};

module.exports = evaluate;
