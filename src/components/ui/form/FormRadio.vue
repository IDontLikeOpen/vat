<script setup>
import { computed } from 'vue';
import { Field } from 'vee-validate';
import { useVModel } from '@vueuse/core';

import useForm from '@/composables/useForm';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: undefined,
  },
  showErrors: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['update:modelValue']);
const localVModel = useVModel(props, 'modelValue', emit);

function changeInput() {
  emit('update:modelValue', !props.modelValue);
}

const formComposable = useForm();

//<editor-fold desc="Availability">
const randomId = formComposable.getRandomCode('input');
const randomErrorId = formComposable.getRandomCode('error');

const isAriaInvalid = computed(() => Boolean(props.showErrors && props.error));
const ariaDescribedby = computed(() => `${randomErrorId}`);
//</editor-fold>
</script>

<template>
  <div class="form-radio-group">
    <div class="form-radio-group__body">
      <Field
        v-slot="{ field, errorMessage }"
        :name="props.name"
        type="radio"
        v-model="localVModel"
      >
        <input
          v-bind="field"
          :id="randomId"
          class="form-radio-group__input"
          type="radio"
          :name="name"
          :value="modelValue"
          :aria-describedby="ariaDescribedby"
          :aria-invalid="isAriaInvalid"
          :checked="modelValue"
          @change="changeInput"
        />

        <label v-show="label" :for="randomId" class="form-radio-group__label">
          <span
            class="form-radio-group__icon form-radio-group__icon--check"
            :class="[{ [`form-radio-group__icon--active`]: modelValue }]"
          />

          <span class="form-radio-group__font form-radio-group__font--label">
            {{ label }}
          </span>
        </label>

        <div
          v-show="showErrors && errorMessage"
          class="form-radio-group__footer"
          :title="errorMessage"
        >
          <span
            :id="randomErrorId"
            aria-live="assertive"
            class="form-radio-group__font form-radio-group__font--error"
          >
          </span>
        </div>
      </Field>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form-radio-group {
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

    &--value {
      font-size: em(30);
      font-weight: $bold;
      line-height: em(50, 30);

      @include media-breakpoint-down(lg) {
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

  &__icon {
    &--check {
      position: relative;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: em(32);
      height: em(32);
      margin-right: em(16);
      background: transparent;
      border: em(2) solid $color-secondary-200;
      border-radius: 50%;
      transition: all $trans-time;

      &::before {
        position: absolute;
        top: 50%;
        left: 50%;
        width: em(18);
        height: em(18);
        content: '';
        background-color: $color-secondary-200;
        border-radius: 50%;
        opacity: 0;
        transition: opacity $trans-time;
        transform: translate(-50%, -50%);

        @include media-breakpoint-down(lg) {
          width: em(10);
          height: em(10);
        }
      }

      @include media-breakpoint-down(lg) {
        width: em(18);
        height: em(18);
        margin-right: em(10);
        border-width: 1px;
      }
    }

    &--active::before {
      opacity: 1;
    }
  }

  &__header {
    min-height: em(20);
    margin-bottom: em(10);

    @include media-breakpoint-down(lg) {
      margin-bottom: em(5);
    }

    @include media-breakpoint-between(sm, md) {
      margin-bottom: em(10);
    }

    @include media-breakpoint-down(sm) {
      min-height: em(15);
    }
  }

  &__body {
    position: relative;
    display: flex;
    align-items: center;
    min-height: em(72);

    @include media-breakpoint-down(lg) {
      min-height: em(52);
    }
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
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba($color-basic-100, 0.7);
  }

  &__fields {
    display: flex;
    column-gap: em(44);
    align-items: center;

    @include media-breakpoint-between(sm, md) {
      flex-direction: column;
      row-gap: em(12);
    }
  }

  &__field {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__input {
    display: none;
  }

  &--error {
    #{$parent} {
      &__font--error {
        color: $color-secondary-500;
      }

      &__icon--check {
        border-color: $color-secondary-500;
      }
    }
  }

  &--inner-indent {
    padding-bottom: em(24);
  }

  &--disabled {
    #{$parent} {
      &__font--value {
        color: rgba($color-basic-375, 0.45);
      }
    }
  }
}
</style>
