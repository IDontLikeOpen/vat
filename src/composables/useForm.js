const getRandomCode = function (name) {
  return `${name}-${Math.floor(Math.random() * 1001)}`;
};

export default () => ({
  getRandomCode,
});
