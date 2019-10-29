const fs = require("fs");
const path = require("path");
const util = require("util");

const compile = require("./src/compile");

const fsReadFile = util.promisify(fs.readFile);
const fsWriteFile = util.promisify(fs.writeFile);

(async () => {
  // Build the expression
  const expr = ["==", ["get", "foo"], "bar"];

  // Compiled Functions
  const functionsSource = await fsReadFile(
    path.resolve(__dirname, "./dist/functions-inc.js")
  );
  eval(functionsSource.toString());

  // Compiled..
  const { source } = compile(expr, functions);
  const compiled = `
// Functions source as IIFE
${functionsSource}

// Context from arguments
const [context] = arguments;

// Wrap the source
const evaluate = function() {
  ${source}
}

// Return the evaluate
return evaluate(context, functions);`;

  // Output to file for debug
  await fsWriteFile(path.resolve(__dirname, "./dist/output.js"), compiled);
  console.log(compiled);

  // Perform...
  const test = new Function(compiled);
  const context = { foo: "bar" };
  const result = test(context);
})();
