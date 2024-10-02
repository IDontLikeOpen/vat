import { ref } from 'vue';

export default () => {
  const requestInProgress = ref(false);

  return {
    requestInProgress,
    waitRequest(callback) {
      if (requestInProgress.value) return;

      requestInProgress.value = true;

      callback().finally(() => {
        requestInProgress.value = false;
      });
    },
  };
};
