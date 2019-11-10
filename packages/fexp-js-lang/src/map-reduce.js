const map = ([collection, fn]) => collection.map(fn);
const reduce = ([collection, fn, initialValue]) =>
  collection.reduce(fn, initialValue);
const filter = ([collection, fn]) => collection.filter(fn);
const find = ([collection, fn]) => collection.find(fn);

module.exports = {
  map,
  reduce,
  filter,
  find
};
