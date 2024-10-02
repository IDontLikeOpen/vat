<script setup>
import { ref, computed, nextTick } from 'vue';
import { Field } from 'vee-validate';
import { useVModel } from '@vueuse/core';

import useForm from '@/composables/useForm';

const formComposable = useForm();

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  showErrors: {
    type: Boolean,
    default: true,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  autoHeight: {
    type: Boolean,
    default: false,
  },
  limitToMaxLength: {
    type: Boolean,
    default: false,
  },
  maxLength: {
    type: Number,
    default: 1000,
  },
  showCounter: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },
  fieldSize: {
    type: String,
    validator(value) {
      return ['base', ''].includes(value);
    },
    default: 'base',
  },
});
const emit = defineEmits(['update:modelValue', 'blur']);
const localVModel = useVModel(props, 'modelValue', emit);

let focused = ref(false);
let textareaItem = ref(false);

function setFocus(value) {
  focused.value = Boolean(value);
}

const maxSymbolsAvailable = computed(() => {
  return props.limitToMaxLength ? props.maxLength : null;
});

const symbolsLeft = computed(() => {
  return Math.max(0, props.maxLength - props.modelValue?.length);
});

//<editor-fold desc="Auto height">
const contentHeight = ref(0);

function setTextareaHeight() {
  if (!props.autoHeight) return;

  contentHeight.value = 0;

  nextTick(() => {
    contentHeight.value = textareaItem.value?.scrollHeight;
  });
}
//</editor-fold>

//<editor-fold desc="Availability">
const randomId = formComposable.getRandomCode('input');
const randomErrorId = formComposable.getRandomCode('error');

const isAriaInvalid = computed(() => Boolean(props.showErrors && props.error));
const ariaDescribedby = computed(() => `${randomErrorId}`);
//</editor-fold>
</script>

<template>
  <Field
    v-slot="{ field, errorMessage }"
    v-model="localVModel"
    :name="name"
    as="div"
  >
    <div
      class="form-textarea"
      :class="{
        'form-textarea--inner-indent': showErrors,
        'form-textarea--disabled': disabled,
        'form-textarea--error': !!errorMessage,
        'form-textarea--active': modelValue || focused,
      }"
    >
      <div class="form-textarea__header">
        <transition name="fade" mode="out-in">
          <label v-show="label" :for="randomId" class="form-textarea__label">
            <span class="form-textarea__font form-textarea__font--label">
              {{ label }}
            </span>
          </label>
        </transition>
      </div>

      <div class="form-textarea__body">
        <textarea
          v-bind="field"
          :id="randomId"
          ref="textareaItem"
          :placeholder="label || placeholder"
          :maxlength="maxSymbolsAvailable"
          class="form-textarea__field"
          :class="{
            [`form-textarea__field--size--${fieldSize}`]: fieldSize,
          }"
          :name="name"
          autocomplete="off"
          :required="isRequired"
          :disabled="disabled"
          :aria-describedby="ariaDescribedby"
          :aria-required="isRequired"
          :aria-invalid="isAriaInvalid"
          @input="setTextareaHeight"
          @focus="setFocus(true)"
          @blur="setFocus(false)"
        />

        <div v-if="showCounter" class="form-textarea__counter">
          <span class="form-textarea__font form-textarea__font--label">
            {{ symbolsLeft }} symbols left
          </span>
        </div>
      </div>

      <span
        v-show="showErrors && errorMessage"
        class="form-textarea__footer"
        :title="errorMessage"
      >
        <span
          :id="randomErrorId"
          aria-live="assertive"
          class="form-textarea__font form-textarea__font--error"
        >
          {{ errorMessage }}
        </span>
      </span>
    </div>
  </Field>
</template>

<style scoped lang="scss">
.form-textarea {
  $parent: &;

  position: relative;

  &__font {
    &--label {
      font-family: $font-accent;
      font-size: em(18);
      font-weight: $medium;
      line-height: 1;

      @include media-breakpoint-down(md) {
        font-size: em(16);
      }

      @include media-breakpoint-down(sm) {
        font-size: em(14);
      }
    }

    &--error {
      font-size: em(16);
      line-height: 1.4;

      @include media-breakpoint-down(md) {
        font-size: em(14);
      }
    }
  }

  &__header {
    min-height: em(20);
    margin-bottom: em(10);

    @include media-breakpoint-down(sm) {
      min-height: em(15);
    }
  }

  &__body {
    position: relative;
    display: block;
    background: transparent;
  }

  &__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    text-align: left;
  }

  &__label {
    display: block;
    color: rgba($color-basic-100, 0.7);
  }

  &__field {
    $font-size: 20;
    $font-size-tablet: 20;
    $font-size-mobile: 16;

    @include hide-scroll;

    width: 100%;
    height: 100%;
    padding: em(20, $font-size) em(40, $font-size);
    font-family: $font-default;
    font-size: em($font-size);
    font-weight: $bold;
    line-height: 1;
    color: $color-basic-850;
    background-color: $color-basic-100;
    border: em(2, $font-size) solid transparent;
    border-radius: em(36, $font-size);
    transition: all $trans-time;

    &::placeholder {
      color: $color-basic-375;
    }

    @include media-breakpoint-down(md) {
      padding: em(16, $font-size-tablet) em(40, $font-size-tablet);
      font-size: em($font-size-tablet);
      border: em(2, $font-size-tablet) solid transparent;
      border-radius: em(33, $font-size-tablet);
    }

    @include media-breakpoint-down(sm) {
      padding: em(15, $font-size-mobile) em(24, $font-size-mobile);
      font-size: em($font-size-mobile);
      border: em(2, $font-size-mobile) solid transparent;
      border-radius: em(20, $font-size-mobile);
    }

    &--size {
      &--base {
        height: em(200, $font-size);

        @include media-breakpoint-down(md) {
          height: em(192, $font-size-tablet);
        }

        @include media-breakpoint-down(sm) {
          height: em(224, $font-size-mobile);
        }
      }
    }
  }

  &__counter {
    position: absolute;
    color: black;
    top: em(7);
    left: em(40);
    font-size: em(12);
  }

  &--error {
    #{$parent} {
      &__font--error {
        color: $color-secondary-500;
      }

      &__field {
        border-color: $color-secondary-500;
      }
    }
  }

  &--inner-indent {
    padding-bottom: em(24);
  }

  &--disabled {
    #{$parent} {
      &__field {
        color: rgba($color-basic-375, 0.45);
      }
    }
  }
}
</style>
