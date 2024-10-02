export default () => ({
  scrollToHash(hash, failCallback = () => {}) {
    if (!hash) return failCallback?.();

    const hashItem = document.querySelector(hash);

    if (!hashItem) return failCallback?.();

    hashItem.scrollIntoView({ behavior: 'smooth' });
  },
});
