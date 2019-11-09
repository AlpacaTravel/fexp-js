const fCase = args => {
  let [...remaining] = args;
  while (remaining.length > 2) {
    const [condition, output] = remaining;
    if (condition) {
      return output;
    }
    [, , ...remaining] = remaining;
  }
  return remaining[0];
};

const match = args => {
  const [target] = args;
  let [, ...remaining] = args;
  while (remaining.length > 2) {
    const [set, output] = remaining;
    if (target === set || (Array.isArray(set) && set.indexOf(target) !== -1)) {
      return output;
    }
    [, , ...remaining] = remaining;
  }
  return remaining[0];
};

module.exports = {
  case: fCase,
  match
};
