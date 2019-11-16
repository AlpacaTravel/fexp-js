const assert = require("assert");

// Create the structure, without executing the params

// fn.parse(args, parser) // returns args invokeables (Literal can stop descending)
// fn.argumentTypes[] // Validates each of the args return types
// fn.returns[] // Used for validation

// Look at the expression
// Map to the function
// IF literal, bypass recurse (var,const,let assignments?)
// IF FN encountered
// Wrap a future context to reset the vars argument
// IF undefined return? Omit?, process without a return argument (e.g. filter out)
// Recurse parse the arguments (DFS to end) to obtain runtimes
// Validate as you go (first pass)
// Return the invokeable version, that takes a future context

// Rerun the invokeable version with the context

// const myMethod = ([a, b]) => a + b;
// myMethod.argumentTypes = [PropTypes.number.isRequired, PropTypes.number.isRequired]

// const literal = ([a]) => a;
// literal.parse = (args) => {
//   const parsed = 0
// }

// const literal = (context) => context.arg(0);
// literal.create = (args) => {
//   return [args[0]];
// }
// literal.returns = [types.any];
// literal.argumentTypes = [types.any];

// const sum = (context) => context.args().reduce((c, t) => c + t, 0);
// sum.returns = [types.number];
// sum.argumentTypes = [types.number];

// create: (args, parser) => {
//   const [arg0, arg1] = args;

//   return [() => {}, [parser.parse(arg0, 0), parser.parse(arg1, 1)]]
// },

// argumentTypes: [
//   types.anyOf(types.number),
//   types.number,
// ],
// returns: [types.number, types.bool]

// Parse an expression
const parse = (expr, lang, options) => {
  if (isExpression(expr)) {
    try {
      // Identify parts
      const name = getFunctionName(expr);
      const args = getFunctionArguments(expr);
      const negate = isFunctionNegated(expr);

      // Obtain the fn
      const fn = getFunction(name, lang);
      assertValidExpressionFunction(fn);

      // Obtain the fn parser for arguments
      const parser = getArgumentsParser(fn, getParser(lang, options));
      const parsedArguments = parser(args);

      // Evaulate the response
      return isFunction(parsedArguments)
        ? createRuntimeFunction(parsedArguments, [], negate)
        : createRuntimeFunction(fn, parsedArguments, negate);
    } catch (e) {
      console.error(`Parse error: ${e.message}`);
      throw e;
    }
  }
  return expr;
};

const getParser = (lang, options) => {
  const parser = expr => parse(expr, lang, options);

  parser.lang = lang;
  parser.options = options;

  return parser;
};

// Takes a function and the parsed arguments
const createRuntimeFunction = (fn, parsedArguments = [], negate = false) => {
  assertValidRuntimeFunction(fn);

  // Build in context
  const invocableFunction = function(context) {
    // Args are supplied, or embedded
    const functionArguments = composeRuntimeArgumentsContext(
      parsedArguments,
      context
    );

    // Supply the runnable context
    const result = fn(functionArguments);

    // Optionally negate the result
    if (negate) {
      return !result;
    }

    return result;
  };

  // Parse reference to the runnable return type
  invocableFunction.returns = fn.returns;

  // Signature on function to identify when to call with runtime for value
  invocableFunction.invocable = true;

  return invocableFunction;
};

// Compose a context surrounding the supplied arguments
const composeRuntimeArgumentsContext = (parsedArguments, context) => {
  // Factory a runtime..
  const factoryRuntime = (context, contextParent) => {
    const runtime = {};

    runtime.get = get(runtime);
    const iterator = getIterator(runtime);
    runtime[Symbol.iterator] = iterator;
    runtime.contextParent = contextParent;
    runtime.context = context;
    runtime.arguments = () => [...iterator()];
    runtime.length = parsedArguments.length;

    // Provide an ability to create sub runtime for the args
    runtime.createSubRuntime = ctx => factoryRuntime(ctx, context);

    return runtime;
  };

  // Generator to invoke obtaining the argument result
  const get = runtime =>
    function(index) {
      const argument = parsedArguments[index];
      if (typeof argument === "function" && argument.invocable === true) {
        return argument(runtime.context); // Add runtime context
      } else {
        return argument;
      }
    };

  // An iterator to process over arguments
  const getIterator = runtime =>
    function*() {
      let x = 0;
      while (x < parsedArguments.length) {
        yield runtime.get(x++);
      }
    };

  // Build the runtime
  return factoryRuntime(context);
};

// Obtain the parser for a function
const getArgumentsParser = (obj, parser) => {
  // Setup a curryable instance
  const parserLocal = expr => parser(expr);

  // Provide a validate types aware of the object
  parserLocal.validateTypes = args => {
    // TODO: Validate the types
    // Take the resolved args, and see if they have corresponding return types
  };

  parserLocal.lang = parser.lang;
  parserLocal.options = parser.options;

  // Evaluate the parsing function
  return (() => {
    // Object provides a parsing implementation
    if (isFunction(obj.parse)) {
      return args => obj.parse(args, parserLocal);
    }

    // Parse using the default parsing behaviour
    return args => {
      const parsedArguments = args.map(parser);

      parserLocal.validateTypes(parsedArguments);

      return parsedArguments;
    };
  })();
};

// Evaluate that the supplied expression is in the correct syntax structure
const isExpression = expr =>
  Array.isArray(expr) && expr.length > 0 && typeof expr[0] === "string";

// Determins if supplied arg is a function
const isFunction = fn => typeof fn === "function";

const isFunctionNegated = ([name]) => name.substr(0, 1) == "!";

// Obtain the function name from the expression
const getFunctionName = expr => {
  const [name] = expr;

  // Allow for negate syntax
  if (name.substr(0, 1) === "!") {
    return name.substr(1);
  }

  return name;
};

// Returns the function arguments
const getFunctionArguments = ([, ...args]) => args;

// Obtain the function from the language
const getFunction = (name, lang) => {
  assertValidLanguage(lang);

  if (lang[name]) {
    return lang[name];
  }

  switch (name) {
    case "!":
      return negate;
    default:
      break;
  }

  return undefined;
};

// Assert a check on the expression syntax
const assertValidExpressionSyntax = expr =>
  assert(
    isExpression(expr),
    "Expression should be an array with the first argument being a string"
  );

// Assert a check on the language
const assertValidLanguage = lang =>
  assert(typeof lang === "object", "Language mapping is not present");

// Assert a check on the function
const assertValidExpressionFunction = fn =>
  assert(typeof fn === "function", "Language function is not valid");

const assertValidRuntimeFunction = obj => {
  assert(obj, "Runtime not found");
  if (typeof obj === "function") {
    return;
  }
  if (typeof obj.run === "function") {
    return;
  }
  throw new Error("Invalid run function");
};

module.exports = {
  getFunctionName,
  isExpression,
  getFunction,
  getArgumentsParser,
  getParser,
  composeRuntimeArgumentsContext,
  createRuntimeFunction,
  parse
};
