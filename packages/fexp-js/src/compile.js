const compile = (expr, fns, depth = 0, ctx = 0) => {
  const compiledResult = (() => {
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
        return isNegating
          ? `negate(${JSON.stringify(args[0])})`
          : JSON.stringify(args[0]);
      }

      // If constructing a subroutine
      if (type === "fn") {
        const nextContext = `{ vars: { arguments: arguments }, prior: ctx${ctx} }`;
        const compiledSub = compile(args[0], fns, depth + 1, ctx + 1);
        return `function() { const ctx${ctx +
          1} = ${nextContext}; const result = ${compiledSub}; return ${
          isNegating ? "negate(result)" : "result"
        }; }`;
      }

      // Evaluate with arguments
      if (type === "evaluate") {
        // Determine the new context
        const nextContext = `{ vars: { arguments: [${compile(
          args[1],
          fns,
          depth + 1,
          ctx
        )}], prior: ctx${ctx} } }`;

        const compiledSub = compile(args[0], fns, depth + 1, ctx + 1);

        // Invoke
        const result = `(() => { const ctx${ctx +
          1} = ${nextContext}; return ${compiledSub}; })()`;

        // Check for negate conditions
        return isNegating ? `negate(${result})` : result;
      }

      // Process the args
      if (typeof fns[type] === "function" || type.length === 0) {
        // Resolve the args
        const resolvedArgs = args.map(arg => compile(arg, fns, depth + 1));

        // Early exit on type
        if (type.length === 0) {
          return `negate(${resolvedArgs[0]})`;
        }

        // Invoke
        const result = `fns['${type}']([${resolvedArgs.join(
          ", "
        )}], ctx${ctx})`;

        // return isNegating ? `!(${result})` : result;
        return isNegating ? `negate(${result})` : result;
      }
      throw new Error(`Unmatched function: ${type}`);
    }

    return JSON.stringify(expr);
  })();

  if (depth === 0) {
    const source = `
// Function arguments
const [fns, ...callArgs] = arguments;

// Negate Check
const negate = (val) => { if (typeof val !== 'boolean') { throw new Error('Can not negate a non-boolean result'); } return !val; };

const ctx0 = { vars: { arguments: callArgs } };

// Compiled Expression
return ${compiledResult};`;
    return { source, compiled: new Function(source) };
  }

  return compiledResult;
};

module.exports = compile;
