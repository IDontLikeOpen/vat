<script setup>
import { ref, computed } from 'vue';
import { Field } from 'vee-validate';
import { vMaska } from 'maska';
import { useVModel } from '@vueuse/core';

import useForm from '@/composables/useForm';

const formComposable = useForm();

const props = defineProps({
  type: {
    default: 'text',
    validator(value) {
      return ['text', 'email', 'search', 'password', 'number'].includes(value);
    },
  },
  inputMode: {
    default: 'text',
    validator(value) {
      return ['text', 'decimal', 'none', 'email'].includes(value);
    },
  },
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
  name: {
    type: String,
    default: '',
  },
  mask: {
    type: String,
    default: undefined,
  },
});
const emit = defineEmits(['update:modelValue', 'blur']);
const localVModel = useVModel(props, 'modelValue', emit);

let focused = ref(false);

function setFocus(value) {
  focused.value = Boolean(value);
}

//<editor-fold desc="Availability">
const randomId = formComposable.getRandomCode('input');
const randomErrorId = formComposable.getRandomCode('error');

const ariaDescribedby = computed(() => `${randomErrorId}`);
//</editor-fold>
</script>

<template>
  <Field
    v-slot="{ field, errorMessage }"
    v-model="localVModel"
    :name="name"
    :type="type"
    as="div"
  >
    <div
      class="form-input"
      :class="{
        'form-input--inner-indent': showErrors,
        'form-input--disabled': disabled,
        'form-input--error': !!errorMessage,
        'form-input--active': modelValue || focused,
      }"
    >
      <div class="form-input__header">
        <transition name="fade" mode="out-in">
          <label v-show="label" :for="randomId" class="form-input__label">
            <span class="form-input__font form-input__font--label">
              {{ label }}
            </span>
          </label>
        </transition>
      </div>

      <div class="form-input__body">
        <span
          v-if="$slots.appendBefore"
          class="form-input__append form-input__append--before"
        >
          <slot name="appendBefore"></slot>
        </span>

        <input
          v-bind="field"
          v-maska
          :data-maska="mask"
          :id="randomId"
          ref="input"
          class="form-input__field"
          :class="{
            [`form-input__field--append-after`]: $slots.appendAfter,
            [`form-input__field--append-before`]: $slots.appendBefore,
          }"
          :inputmode="inputMode"
          autocomplete="off"
          :disabled="disabled"
          :required="isRequired"
          :placeholder="label || placeholder"
          :aria-describedby="ariaDescribedby"
          :aria-required="isRequired"
          :aria-invalid="Boolean(props.showErrors && errorMessage)"
          @focus="setFocus(true)"
          @blur="setFocus(false)"
        />

        <span class="form-input__append form-input__append--after">
          <slot name="appendAfter"> </slot>
        </span>
      </div>

      <span
        v-show="showErrors && errorMessage"
        class="form-input__footer"
        :title="errorMessage"
      >
        <span
          :id="randomErrorId"
          aria-live="assertive"
          class="form-input__font form-input__font--error"
        >
          {{ errorMessage }}
        </span>
      </span>
    </div>
  </Field>
</template>

<style scoped lang="scss">
.form-input {
  $parent: &;

  position: relative;

  &__font {
    &--label {
      font-family: $font-accent;
      font-size: em(18);
      font-weight: $medium;
      line-height: 1;

      @include media-breakpoint-down(lg) {
        font-size: em(14);
      }

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

      @include media-breakpoint-down(lg) {
        font-size: em(14);
      }
    }
  }

  &__header {
    min-height: em(20);
    margin-bottom: em(10);

    @include media-breakpoint-down(lg) {
      margin-bottom: em(5);
    }

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
    bottom: em(2);
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
    $fontSize: 20;
    $fontSizeTablet: 20;
    $fontSizeMobile: 16;

    width: 100%;
    height: em(72, $fontSize);
    padding: em(20, $fontSize) em(40, $fontSize);
    font-family: $font-default;
    font-size: em($fontSize);
    font-weight: $bold;
    line-height: 1;
    color: $color-basic-850;
    background-color: $color-basic-100;
    border: em(2, $fontSize) solid transparent;
    border-radius: em(150, $fontSize);
    transition: all $trans-time;

    &::placeholder {
      color: $color-basic-375;
    }

    @include media-breakpoint-down(lg) {
      height: em(52, $fontSizeMobile);
      padding: em(14, $fontSizeMobile) em(24, $fontSizeMobile)
        em(15, $fontSizeMobile);
      font-size: em($fontSizeMobile);
      border: em(2, $fontSizeMobile) solid transparent;
      border-radius: em(74, $fontSizeMobile);
    }

    @include media-breakpoint-down(md) {
      height: em(64, $fontSizeTablet);
      padding: em(16, $fontSizeTablet) em(40, $fontSizeTablet);
      font-size: em($fontSizeTablet);
      border: em(2, $fontSizeTablet) solid transparent;
      border-radius: em(140, $fontSizeTablet);
    }

    @include media-breakpoint-down(sm) {
      height: em(52, $fontSizeMobile);
      padding: em(15, $fontSizeMobile) em(24, $fontSizeMobile);
      font-size: em($fontSizeMobile);
      border: em(2, $fontSizeMobile) solid transparent;
      border-radius: em(74, $fontSizeMobile);
    }

    &--append-before {
      padding-left: em(70, $fontSize);

      @include media-breakpoint-down(md) {
        padding-left: em(50, $fontSizeTablet);
      }

      @include media-breakpoint-down(sm) {
        padding-left: em(50, $fontSizeMobile);
      }
    }

    &--append-after {
      padding-right: em(70, $fontSize);

      @include media-breakpoint-down(md) {
        padding-right: em(50, $fontSizeTablet);
      }

      @include media-breakpoint-down(sm) {
        padding-right: em(50, $fontSizeMobile);
      }
    }
  }

  &__append {
    position: absolute;
    top: 50%;
    display: flex;
    line-height: 1;
    cursor: pointer;
    transform: translateY(-50%);

    &--before {
      left: em(18);

      @include media-breakpoint-down(md) {
        left: em(13);
      }
    }

    &--after {
      right: em(18);

      @include media-breakpoint-down(md) {
        right: em(13);
      }
    }
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
