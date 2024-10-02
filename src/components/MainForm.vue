<script setup>
import { computed, reactive, watch } from 'vue';
import { Form, configure } from 'vee-validate';
import { object, string, boolean, number } from 'yup';

import FormInput from '@/components/ui/form/FormInput.vue';
import FormRadio from '@/components/ui/form/FormRadio.vue';
import FormTextarea from '@/components/ui/form/FormTextarea.vue';
import FormSelect from '@/components/ui/form/FormSelect.vue';

configure({
  validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
  validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
  validateOnInput: true, // controls if `input` events should trigger validation with `handleChange` handler
  validateOnModelUpdate: true, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
});

const maxMessageLength = 255;

const specialFloatValidator = (value) => {
  if (!value) return false; // Return false if value is not provided (required will catch this)

  return /^\d+([.,]\d+)?$/.test(value); // Check if there's a number
};

const specialFloatValidatorData = {
  name: 'priceNettoEurIsCorrectNumber', // Custom test name, useful for error reporting
  message: 'Please, input number', // Error message if validation fails,
  test: specialFloatValidator,
};

const isNotZeroValidator = (value) => {
  return Number(value) !== 0;
};

const isNotZeroValidatorData = {
  name: 'priceNettoEurIsNotZero', // Custom test name, useful for error reporting
  message: 'Text is required', // Error message if validation fails,
  test: isNotZeroValidator,
};

const validationSchema = object({
  description: string().required().max(maxMessageLength),
  sendConfirmation: boolean().required().isTrue(),
  vat: number().required(),
  priceNettoEur: string()
    .required()
    .test(isNotZeroValidatorData)
    .test(specialFloatValidatorData),
  priceBruttoEur: number().required(),
});

const formData = reactive({
  description: '',
  sendConfirmation: false,
  vat: 0,
  priceNettoEur: '',
  priceBruttoEur: null,
});

const emit = defineEmits(['submit']);

const vatOptions = [
  {
    label: '19%',
    value: 19,
  },
  {
    label: '21%',
    value: 21,
  },
  {
    label: '23%',
    value: 23,
  },
  {
    label: '25%',
    value: 25,
  },
];

const currentVat = computed({
  get() {
    if (!formData.vat) {
      return;
    }

    return vatOptions.find(({ value }) => value === formData.vat);
  },
  set(newVat) {
    formData.vat = newVat?.value;
  },
});

watch([() => formData.priceNettoEur, () => formData.vat], ([price]) => {
  const priceNettoEurAdapted = Number(price?.replace(',', '.'));

  if (!priceNettoEurAdapted) {
    formData.priceBruttoEur = 0;

    return;
  }

  formData.priceBruttoEur = priceNettoEurAdapted * (formData.vat / 100 + 1);
});

const onSubmit = function () {
  emit('submit', formData);
};
</script>

<template>
  <Form
    class="feedback-form"
    :validation-schema="validationSchema"
    @submit="onSubmit"
  >
    <FormTextarea
      v-model="formData.description"
      name="description"
      label="Description"
      :max-length="maxMessageLength"
      show-counter
      class="feedback-form__field"
    ></FormTextarea>

    <FormRadio
      v-model="formData.sendConfirmation"
      name="sendConfirmation"
      label="Send confirmation"
      class="feedback-form__field"
    />

    <FormSelect
      v-model="currentVat"
      label="VAT"
      :select-config="{
        trackBy: 'value',
        label: 'label',
        placeholder: 'Choose VAT',
      }"
      :options="vatOptions"
      name="vat"
      class="feedback-form__field"
    />

    <FormInput
      v-model="formData.priceNettoEur"
      name="priceNettoEur"
      label="Price netto EUR"
      :disabled="!formData.vat"
      class="feedback-form__field"
    />

    <FormInput
      v-model="formData.priceBruttoEur"
      name="priceBruttoEur"
      label="Price brutto EUR"
      disabled
      class="feedback-form__field"
    />

    <button type="submit" class="button feedback-form__button">
      <span class="feedback-form__font feedback-form__font--button">
        Submit
      </span>
    </button>
  </Form>
</template>

<style scoped lang="scss">
.feedback-form {
  &__font {
    &--title {
      font-family: $font-default;
      font-size: em(54);
      font-weight: $bold;
      line-height: em(64, 54);

      @include media-breakpoint-down(md) {
        font-size: em(50);
        line-height: em(60, 50);
      }

      @include media-breakpoint-down(sm) {
        font-size: em(32);
        line-height: em(42, 32);
      }
    }

    &--description {
      font-family: $font-accent;
      font-size: em(18);
      font-weight: $medium;
      line-height: em(26, 18);

      @include media-breakpoint-down(md) {
        font-size: em(16);
        line-height: em(24, 16);
      }

      @include media-breakpoint-down(md) {
        font-size: em(14);
        line-height: em(22, 14);
      }
    }

    &--button {
      font-size: em(30);
      font-weight: $bold;

      @include media-breakpoint-down(sm) {
        font-size: em(20);
      }
    }

    &--checkbox {
      font-family: $font-accent;
      font-size: em(15);
      font-weight: $medium;
      line-height: em(26, 15);
      color: rgba($color-basic-100, 0.85);

      @include media-breakpoint-down(md) {
        font-size: em(14);
      }

      @include media-breakpoint-down(sm) {
        font-size: em(10);
      }
    }
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: em(30);

    @include media-breakpoint-down(sm) {
      margin-bottom: em(10);
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: em(24);

    @include media-breakpoint-down(sm) {
      margin-top: em(10);
    }
  }

  &__title {
    margin-bottom: em(5);
    text-align: center;
  }

  &__description {
    text-align: center;
  }

  &__field {
    width: 100%;

    &:not(:first-child) {
      margin-top: em(24);
    }
  }

  &__checkbox {
    &:not(:first-child) {
      margin-top: em(14);
    }
  }

  &__button {
    width: 100%;
    max-width: em(320);
    height: em(80);
    border-radius: em(80);
    color: $color-basic-100;
    background: $color-secondary-250;
    margin: 0 auto;

    &::before {
      content: none;
    }

    @include hover {
      color: $color-basic-100;
      background: $color-secondary-500;
    }

    @include media-breakpoint-down(sm) {
      height: em(56);
    }
  }

  &__link {
    text-decoration: underline;
  }
}
</style>
