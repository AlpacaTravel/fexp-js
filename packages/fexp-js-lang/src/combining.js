const isFalseMatch = arg => {
  if (arg === false || typeof arg === "undefined" || arg === null) {
    return true;
  }

  return false;
};

const all = args => {
  for (const arg of args) {
    if (isFalseMatch(arg)) {
      return false;
    }
  }

  return true;
};

const any = args => {
  for (const arg of args) {
    if (!isFalseMatch(arg)) {
      return true;
    }
  }

  return false;
};
const none = args => {
  for (const arg of args) {
    if (!isFalseMatch(arg)) {
      return false;
    }
  }

  return true;
};

module.exports = {
  all,
  any,
  none
};
