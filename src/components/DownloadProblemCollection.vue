<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Download } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@vueuse/core';
import { downloadFile } from '@/lib/utils';

// Persist the selected language in local storage
// This will allow the user to switch between languages and have their choice remembered
const chosenLanguage = useLocalStorage('chosenLanguage', 'python');

function downloadCollection() {
  const fileName = `${chosenLanguage.value}-collection.zip`;

  downloadFile(`/collections/${fileName}`, fileName);
}
</script>

<template>
  <div class="mt-4 flex items-center gap-2">
    <Select v-model="chosenLanguage">
      <SelectTrigger class="w-[120px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent class="w-[120px]">
        <SelectGroup>
          <SelectLabel>Language</SelectLabel>
          <SelectItem value="python"> Python </SelectItem>
          <SelectItem value="matlab"> Matlab </SelectItem>
          <SelectItem value="gams"> GAMS </SelectItem>
          <SelectItem value="latex"> LaTeX </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <Button @click="downloadCollection">
      <Download />
      Download
    </Button>
  </div>
</template>
