const fIn = args => {
  const [value, ...remaining] = args;
  if (Array.isArray(value)) {
    return value.reduce(
      (carry, comp) => carry || remaining.indexOf(comp) > -1,
      false
    );
  }
  return remaining.indexOf(value) > -1;
};

module.exports = {
  in: fIn
};
