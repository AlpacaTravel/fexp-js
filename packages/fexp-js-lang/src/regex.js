const regexTest = args => {
  const [prop, regex] = args;
  const value = resolveContext(context, prop);
  if (!(regex instanceof RegExp)) {
    return false;
  }
  return regex.test(value);
};

module.exports = {
  "regex-test": regexTest
};
