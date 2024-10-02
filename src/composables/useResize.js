import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import throttle from 'lodash/throttle';
import merge from 'lodash/merge';
import pick from 'lodash/pick';

const devices = {
  desktop: 'desktop',
  desktopSmall: 'desktopSmall',
  tablet: 'tablet',
  mobile: 'mobile',
};
const configDefault = {
  [devices.desktop]: {
    width: 1920,
    minWidth: 1280,
  },
  [devices.tablet]: {
    width: 768,
    minWidth: 540,
  },
  [devices.mobile]: {
    width: 320,
    minWidth: 240,
  },
};

const defaultFontSize = 16;
let vW = ref(0);
let vH = ref(0);

export default function useResize(props) {
  const emitResize = () => {
    // Вызывайте это событие, если необходимо
    props?.onResize?.();
  };
  const configLocal = computed(() => {
    const defaultKeys = Object.keys(configDefault);
    return merge({}, configDefault, pick(props?.config, defaultKeys));
  });

  const fSize = computed(() => {
    if (!vW.value || !device.value) return defaultFontSize;

    const {
      width,
      height,
      minWidth = 0,
      minHeight = 0,
      staticSelectors,
    } = configLocal.value[device.value];

    const horizontalRatio = Math.max(minWidth, vW.value) / width;

    if (!height) return defaultFontSize * horizontalRatio;

    const staticHeight = calculateStaticElementsHeight(staticSelectors);

    const verticalRatio =
      Math.max(minHeight, vH.value - staticHeight) / (height - staticHeight);
    const minRatio = Math.min(horizontalRatio, verticalRatio);

    return defaultFontSize * minRatio;
  });

  function calculateStaticElementsHeight(selectors) {
    if (!selectors) return 0;

    const elements = document.querySelectorAll(selectors.join(','));

    return [...elements].reduce((totalHeight, el) => {
      return totalHeight + el.clientHeight;
    }, 0);
  }

  const onResize = throttle(async function (needEmit = true) {
    vW.value = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth,
    );
    vH.value = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight,
    );

    if (needEmit)
      await nextTick(() => {
        emitResize();
      });
  }, 100);

  const device = computed(() => {
    const configEntries = Object.entries(configLocal.value).filter(
      ([, deviceConfig]) => deviceConfig?.width,
    );

    const configEntry =
      configEntries.find(([, config]) => vW.value >= config.minWidth) ||
      configEntries[configEntries.length - 1];

    return configEntry?.[0];
  });

  onMounted(() => {
    window.addEventListener('resize', onResize);
    onResize();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
  });

  return { fSize };
}
