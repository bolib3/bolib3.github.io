<script setup lang="ts">
import { DownloadIcon } from 'lucide-vue-next';
import Button from './ui/button/Button.vue';
import { downloadFile } from '@/lib/utils';

const download = () =>
  downloadFile('/collections/dataset-collection.zip', 'dataset-collection.zip');
</script>

<template>
  <Button class="mt-4 p-0" @click="download">
    <DownloadIcon />
    Download all datasets
  </Button>
</template>
