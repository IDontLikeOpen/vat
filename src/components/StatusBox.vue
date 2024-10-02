<script setup>
import { computed } from 'vue';

import { statusesKeys } from '@/configs/statuses';

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    validator(status) {
      const statuses = Object.values(statusesKeys);

      return statuses.includes(status);
    },
    default: 'success',
  },
});

const textsByStatus = {
  [statusesKeys.success]: 'Success!',
  [statusesKeys.error]: 'Something went wrong...',
};

const currentText = computed(() => {
  return textsByStatus[props.status];
});
</script>

<template>
  <div class="status-box" :class="[`status-box--${props.status}`]">
    <div class="status-box__font">
      {{ currentText }}

      <template v-if="props.text">
        <br />
        <br />
        {{ props.text }}
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.status-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 10px solid $color-basic-100;
  border-radius: em(20);
  background-color: white;
  color: $color-basic-800;
  padding: em(50);

  &__font {
    font-family: $font-accent;
    font-size: em(18);
    font-weight: $medium;
    line-height: 1;
  }

  &--success {
    border-color: $color-success-100;
  }

  &--error {
    border-color: $color-danger-100;
  }
}
</style>
