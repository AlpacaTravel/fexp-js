const all = args => args.every(arg => arg);
const any = args => args.some(arg => arg);
const none = args => !any(args);

module.exports = {
  all,
  any,
  none
};
