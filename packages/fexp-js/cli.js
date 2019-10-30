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
    path.resolve(__dirname, "../fexp-js-lang/dist/index-inc.js")
  );

  // Eval named export of "var lang = ..."
  eval(functionsSource.toString());

  // Compiled..
  const { source } = compile(expr, lang);

  // Wrap in a function() { } and can be bound to this..
  const compiled = `function() {
  // Functions source as IIFE
  ${functionsSource}

  // Context from arguments
  const [context] = arguments;

  // Wrap the source
  const evaluate = function() {
    ${source}
  }

  // Return the evaluate
  return evaluate(lang, this);
}`;

  // Output to file for debug
  console.log(compiled);
})();
