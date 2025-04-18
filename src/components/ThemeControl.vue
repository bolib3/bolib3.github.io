<script setup lang="ts">
import { Button } from './ui/button';
import { useLocalStorage } from '@vueuse/core';
import { SunIcon, MoonIcon } from 'lucide-vue-next';

const theme = useLocalStorage<'light' | 'dark'>('theme', 'light');

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
}
</script>

<template>
  <Button @click="toggleTheme" variant="ghost">
    <SunIcon v-if="theme === 'dark'" class="h-4 w-4" />

    <MoonIcon v-else class="h-4 w-4" />
  </Button>
</template>
