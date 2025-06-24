<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Copy, CopyCheck } from 'lucide-vue-next';
import { ref } from 'vue';

const props = defineProps<{
  text: string;
  class?: string;
}>();

const copied = ref(false);

async function copy() {
  await navigator.clipboard.writeText(props.text);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>

<template>
  <Button @click="copy" variant="ghost" size="icon" title="Copy to clipboard" :class="props.class">
    <CopyCheck v-if="copied" />
    <Copy v-else />
  </Button>
</template>
