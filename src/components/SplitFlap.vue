<script setup lang="ts">
import { delay } from '@/lib/utils';
import { computed, ref, watchEffect } from 'vue';

const props = defineProps<{
  digit: string;
  duration: number;
}>();

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

const UPPER_START = 'upperFlap__start' as const;
const UPPER_END = 'upperFlap__end' as const;
const BOTTOM_START = 'bottomFlap__start' as const;
const BOTTOM_END = 'bottomFlap__end' as const;

const index = ref(0);
const currentDigit = computed(() => digits[index.value]);
const nextDigit = computed(() => digits[index.value === digits.length - 1 ? 0 : index.value + 1]);

const upperFlapAnimState = ref<typeof UPPER_START | typeof UPPER_END>(UPPER_START);
const bottomFlapAnimState = ref<typeof BOTTOM_START | typeof BOTTOM_END>(BOTTOM_START);

const targetIndex = Math.max(
  digits.findIndex((el) => el === props.digit),
  0
);
const delayDuration = props.duration / targetIndex;
const animationDuration = `${delayDuration / 2}ms`;

async function flip() {
  await delay(delayDuration / 2);
  upperFlapAnimState.value = UPPER_END;
  await delay(delayDuration / 2);
  bottomFlapAnimState.value = BOTTOM_END;
  await delay(delayDuration / 2);
  index.value++;
  upperFlapAnimState.value = UPPER_START;
  bottomFlapAnimState.value = BOTTOM_START;
}

watchEffect(async () => {
  if (index.value < targetIndex) {
    await flip();
  }
});
</script>

<template>
  <div class="relative flex flex-col">
    <div class="upper">
      <span class="next">
        {{ nextDigit }}
      </span>
      <span class="current" :class="upperFlapAnimState">
        {{ currentDigit }}
      </span>
    </div>

    <div class="bottom">
      <span class="next" :class="bottomFlapAnimState">
        {{ nextDigit }}
      </span>
      <span class="current">
        {{ currentDigit }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="css">
span {
  padding: 0.4rem;
  font-size: smaller;
  color: white;
  background-color: hsl(0, 0%, 20%);
  font-family: monospace;
  text-align: center;
}

.next,
.current {
  border-radius: 0.2rem;
}

.upper .next,
.bottom .current {
  z-index: 1;
}

.upper .current,
.bottom .next {
  z-index: 2;
}

.upper,
.bottom {
  display: flex;
  flex-direction: column;
}

.bottom {
  position: absolute;
}

.current {
  position: absolute;
}

.upperFlap__start {
  transform: perspective(5cm) rotateX(0turn);
  filter: brightness(1);
}

.upperFlap__end {
  transform: perspective(5cm) rotateX(-0.25turn);
  filter: brightness(0);
  transition-duration: v-bind('animationDuration');
  transition-timing-function: ease-in;
}

.bottomFlap__start {
  transform: perspective(5cm) rotateX(0.25turn);
  filter: brightness(3);
}

.bottomFlap__end {
  transform: perspective(5cm) rotateX(0turn);
  filter: brightness(1);
  transition-duration: v-bind('animationDuration');
  transition-timing-function: ease-out;
}

.upper * {
  clip-path: inset(0 0 50% 0);
}

.bottom * {
  clip-path: inset(50% 0 0 0);
}
</style>
