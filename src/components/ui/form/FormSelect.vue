<script setup>
import { ref, computed } from 'vue';
import merge from 'lodash/merge';
import { useVModel } from '@vueuse/core';
import { Field } from 'vee-validate';
import Multiselect from 'vue-multiselect';

import useForm from '@/composables/useForm';

const formComposable = useForm();

const props = defineProps({
  selectConfig: {
    type: Object,
    default: () => ({}),
  },
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number, Object],
    default: '',
  },
  name: {
    required: true,
    type: String,
  },
  options: {
    required: true,
    type: Array,
  },
  isDisabled: {
    required: false,
    type: Boolean,
    default: false,
  },
  showErrors: {
    type: Boolean,
    default: true,
  },
});

//<editor-fold desc="Base">
const emit = defineEmits(['update:modelValue', 'openSelect', 'closeSelect']);

const isFocused = ref(false);
const selectItem = ref(null);
const selectConfig = merge(
  {
    searchable: false,
    preselectFirst: false,
    placeholder: '',
    openDirection: '',
    allowEmpty: false,
    showLabels: false,
  },
  props.selectConfig,
);

const localValue = useVModel(props, 'modelValue', emit);

function openSelect() {
  selectItem.value.activate(); // метод компонента multiselect
}

function openHandler() {
  emit('openSelect');

  isFocused.value = true;
}

function closeHandler() {
  isFocused.value = false;

  emit('closeSelect');
}
//</editor-fold>

//<editor-fold desc="Availability">
const randomSelectId = formComposable.getRandomCode('select');
const randomErrorId = formComposable.getRandomCode('error');

const isAriaInvalid = computed(() => Boolean(props.showErrors && props.error));
const ariaDescribedby = computed(() => `${randomErrorId}`);
const ariaExpanded = computed(() => {
  return isFocused.value ? 'true' : 'false';
});
//</editor-fold>
</script>

<template>
  <Field
    v-slot="{ errorMessage }"
    :name="name"
    as="div"
    :model-value="modelValue?.[props.selectConfig.trackBy]"
  >
    <div
      class="form-select"
      :class="[
        {
          'form-select--active': isFocused,
          'form-select--has-value': modelValue,
          'form-select--disabled': isDisabled,
          'form-select--inner-indent': showErrors,
        },
      ]"
      @mousedown="openSelect"
    >
      <div v-if="props.label" :class="[`form-select__label`]">
        <span :class="[`form-select__font form-select__font--label`]">
          {{ props.label }}
        </span>
      </div>

      <multiselect
        v-model="localValue"
        v-bind="selectConfig"
        :id="randomSelectId"
        ref="selectItem"
        :class="[
          `form-select__field`,
          {
            [`form-select__field--error`]: errorMessage,
            'multiselect--custom--option': $slots.option,
            'multiselect--custom--single': $slots.single,
          },
        ]"
        :options="options"
        :name="name"
        :aria-describedby="ariaDescribedby"
        :aria-invalid="isAriaInvalid"
        :aria-expanded="ariaExpanded"
        @open="openHandler"
        @close="closeHandler"
      >
        <template #caret="{ toggle }">
          <button
            :class="[
              `form-select__arrow`,
              {
                'form-select__arrow--reversed': isFocused,
              },
            ]"
            type="button"
            aria-label="Показать список"
            @mousedown.prevent.stop="toggle"
          >
            <svg
              class="form-select__icon form-select__icon--arrow"
              width="14"
              height="26"
              viewBox="0 0 14 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 2L12.5 13L1.5 24"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </template>

        <template v-if="$slots.option" #option="{ option }">
          <slot name="option" :option="option"></slot>
        </template>

        <template v-if="$slots.single" #singleLabel="{ option }">
          <slot name="single" :option="option"></slot>
        </template>

        <template #noResult>
          <span :class="`form-select__element form-select__element--disabled`">
            Поиск не дал результатов
          </span>
        </template>

        <template #noOptions>
          <span :class="`form-select__element form-select__element--disabled`">
            Список пуст
          </span>
        </template>
      </multiselect>

      <span
        v-show="showErrors && errorMessage"
        class="form-select__footer"
        :title="errorMessage"
      >
        <span
          :id="randomErrorId"
          aria-live="assertive"
          class="form-select__font form-select__font--error"
        >
          {{ errorMessage }}
        </span>
      </span>
    </div>
  </Field>
</template>

<style lang="scss" scoped>
.form-select {
  $parent: &;

  position: relative;
  color: $color-basic-100;

  &:deep(.multiselect__tags) {
    padding: em(13) em(20);
    color: $color-basic-100;

    @include hover {
      color: $color-basic-250;
    }
  }

  &:deep(.multiselect__content-wrapper) {
    max-height: em(330) !important;
    background-color: $color-secondary-200;
    border-radius: em(12);

    @include media-breakpoint-down(rt) {
      max-height: em(200) !important;
    }
  }

  &:deep(.multiselect__content) {
    max-height: em(330);

    @include media-breakpoint-down(rt) {
      max-height: em(200);
    }
  }

  &:deep(.multiselect__element) {
    height: em(44);
  }

  &:deep(.multiselect__single) {
    font-size: em(18);
    font-weight: $bold;
  }

  &:deep(.multiselect__option) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 em(20, 18);
    font-size: em(18);
    font-weight: $bold;
    color: $color-basic-100;
    background-color: transparent;
    transition:
      background-color $trans-time-fast,
      color $trans-time-fast;

    @include hover {
      color: $color-basic-250;
      background-color: rgba($color-secondary-250, 0.75);
    }
  }

  &:deep(.multiselect__option--highlight:not(:hover)) {
    color: $color-basic-250;
    background-color: rgba($color-secondary-250, 0.5);
  }

  &__font {
    &--label {
      font-size: em(15);
    }
  }

  &__icon {
    &--arrow {
      width: em(11);
      height: em(14);
      transform: rotate(90deg);
    }
  }

  &__footer {
    display: block;
    min-height: em(27);
    margin-top: em(3);
  }

  &__label {
    padding-bottom: em(8);
  }

  &__field {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: em(52);
    padding: 0;
    margin: 0;
    color: inherit;
    cursor: pointer;
    background-color: $color-secondary-200;
    border: 1px solid transparent;
    border-radius: em(8);
    transition: border-color $trans-time;

    &:focus {
      //border-color: $color-third-350;
    }
  }

  &__option {
    display: block;
  }

  &__arrow {
    position: absolute;
    top: 50%;
    right: em(5);
    z-index: $level-2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: em(30);
    height: em(30);
    color: inherit;
    transition: color $trans-time;
    transform: translateY(-50%);
    will-change: transform;

    @include hover {
      color: $color-basic-250;
    }

    &--reversed {
      top: auto;
      bottom: 50%;
      transform: translateY(50%) scale(-1);
    }
  }

  &--active {
    &:deep(.multiselect__tags) {
      color: $color-basic-250;
    }
    #{$parent}__arrow {
      color: $color-basic-250;
    }
  }

  &--disabled {
    cursor: default;
    opacity: 0.5;

    &:deep(.multiselect__tags) {
      pointer-events: none;
      touch-action: none;

      @include hover {
        color: inherit;
      }
    }
  }

  &--overflowing:deep(.multiselect__content) {
    //padding-right: em(15);
  }
}
</style>
