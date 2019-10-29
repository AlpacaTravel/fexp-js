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
 * @param {object} context Supplied context
 * @param {object} fns Supplied named functions
 */
const evaluate = (expr, fns, context = null) => {
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

    // Evaluate
    if (type === "evaluate") {
      // Determine the new context
      const nextContext = evaluate(args[1], fns, context);

      // Invoke
      const result = evaluate(args[0], fns, nextContext);

      // Check for negate conditions
      return isNegating ? negate(result) : result;
    }

    // Process the args
    const fn = type.length === 0 ? nOpArg0 : fns && fns[type];
    if (typeof fn === "function") {
      // Resolve the args
      const resolvedArgs = args.map(arg => evaluate(arg, fns, context));

      // Invoke
      const result = fn(resolvedArgs, context);
      return isNegating ? negate(result) : result;
    }
    throw new Error(`Unmatched function: ${type}`);
  }

  return expr;
};

module.exports = evaluate;
