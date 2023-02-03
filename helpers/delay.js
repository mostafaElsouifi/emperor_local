// this Returns a promise that resolves after a specified number of seconds

module.exports = delay = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};
