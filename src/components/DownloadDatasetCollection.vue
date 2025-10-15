<script setup lang="ts">
import { DownloadIcon } from 'lucide-vue-next';
import Button from './ui/button/Button.vue';
import { downloadFile } from '@/lib/utils';

const download = () =>
  downloadFile('/collections/dataset-collection.zip', 'dataset-collection.zip');
</script>

<template>
  <Button @click="download" data-umami-event="download-dataset-collection">
    <DownloadIcon />
    Download all datasets
  </Button>
</template>
