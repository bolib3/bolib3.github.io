<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { snakeCase } from '@/lib/utils';
import type { Problem } from '@/types';
import { MoreHorizontal } from 'lucide-vue-next';

defineProps<{
  problem: Problem;
}>();

function copy(text: string) {
  navigator.clipboard.writeText(text);
}

function downloadDataset(problem: Problem) {
  downloadFile('/sample/bilevel.csv', snakeCase(problem.name) + '.csv');
}

function downloadPython(problem: Problem) {
  downloadFile('/sample/bilevel.py', snakeCase(problem.name) + '.py');
}

function downloadMatLab(problem: Problem) {
  downloadFile('/sample/bilevel.m', snakeCase(problem.name) + '.m');
}

function downloadFile(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @click="copy(problem.name)"> Copy name </DropdownMenuItem>
      <DropdownMenuItem> Copy citation </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="downloadDataset(problem)">
        Download dataset <code>50mb</code></DropdownMenuItem
      >
      <DropdownMenuItem @click="downloadPython(problem)">Download Python</DropdownMenuItem>
      <DropdownMenuItem @click="downloadMatLab(problem)">Download MatLab</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
