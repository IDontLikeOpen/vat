<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';

import MainForm from '@/components/MainForm.vue';
import StatusBox from '@/components/StatusBox.vue';

import { statusesKeys } from '@/configs/statuses';

const isSubmitted = ref(false);
const submitData = reactive({
  status: '',
  text: '',
});

const sendDataOnSubmit = function (formData) {
  axios
    .post('https://jsonplaceholder.typicode.com/posts', formData)
    .then(() => {
      submitData.status = statusesKeys.success;
      submitData.text = 'Data submitted successfully';
    })
    .catch(() => {
      submitData.status = statusesKeys.error;
      submitData.text = 'Something went wrong, try again';
    })
    .finally(() => {
      isSubmitted.value = true;
    });
};
</script>

<template>
  <main class="wrapper">
    <transition name="fade" mode="out-in">
      <MainForm
        v-if="!isSubmitted"
        class="wrapper__form"
        @submit="sendDataOnSubmit"
      />

      <StatusBox v-else class="wrapper__box" v-bind="submitData" />
    </transition>
  </main>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  &__form {
    padding: em(20);
  }

  &__box {
    margin: em(50);
  }
}
</style>
