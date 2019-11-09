const regexTest = args => {
  const [value, regex] = args;
  if (!(regex instanceof RegExp)) {
    return false;
  }
  return regex.test(value);
};

module.exports = {
  "regex-test": regexTest
};
