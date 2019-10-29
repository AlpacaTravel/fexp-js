const accessors = require("./accessors");
const combining = require("./combining");
const compareable = require("./compareable");
const existence = require("./existence");
const math = require("./math");
const membership = require("./membership");
const regex = require("./regex");
const string = require("./string");
const type = require("./type");

module.exports = Object.assign(
  {},
  string,
  type,
  math,
  compareable,
  existence,
  accessors,
  combining,
  membership,
  regex
);
