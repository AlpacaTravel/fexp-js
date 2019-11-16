const fCase = args => {
  const iterator = args[Symbol.iterator]();

  const pair = function*() {
    while (true) {
      const arg0 = iterator.next();
      const arg1 = iterator.next();
      if (!arg1.done) {
        yield [arg0.value, arg1.value];
      } else {
        yield arg0.value;
      }
    }
  };

  for (const cases of pair(args)) {
    if (Array.isArray(cases)) {
      const [kase, output] = cases;
      if (kase) {
        return output;
      }
    } else {
      return cases;
    }
  }
};

const match = args => {
  const iterator = args[Symbol.iterator]();
  const target = iterator.next().value;

  const pair = function*() {
    while (true) {
      const arg0 = iterator.next();
      const arg1 = iterator.next();
      if (!arg1.done) {
        yield [arg0.value, arg1.value];
      } else {
        yield arg0.value;
      }
    }
  };

  for (const match of pair(args)) {
    if (Array.isArray(match)) {
      const [set, output] = match;
      if (
        target === set ||
        (Array.isArray(set) && set.indexOf(target) !== -1)
      ) {
        return output;
      }
    } else {
      return match;
    }
  }
};

module.exports = {
  case: fCase,
  match
};
