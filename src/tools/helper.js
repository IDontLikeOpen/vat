export const getRandomInt = (min, max) => {
  const localMin = Math.ceil(min);
  const localMax = Math.floor(max);

  return Math.floor(Math.random() * (localMax - localMin) + localMin);
};

export function dLayer(data) {
  if ('dataLayer' in window) {
    window.dataLayer?.push(data);
  }
}
