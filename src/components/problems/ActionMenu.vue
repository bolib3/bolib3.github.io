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
import { downloadFile, snakeCase } from '@/lib/utils';
import type { Problem } from '@/types';
import { MoreHorizontal } from 'lucide-vue-next';
import { computed } from 'vue';
import { slugify } from '../../lib/utils';

const props = defineProps<{
  problem: Problem;
}>();

const slug = computed(() => slugify(props.problem.name));

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

function downloadJulia(problem: Problem) {
  downloadFile('/sample/bilevel.jl', snakeCase(problem.name) + '.jl');
}

function downloadAMPL(problem: Problem) {
  downloadFile('/sample/bilevel.mod', snakeCase(problem.name) + '.mod');
}

function downloadGAMS(problem: Problem) {
  downloadFile('/sample/bilevel.gms', snakeCase(problem.name) + '.gms');
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
      <DropdownMenuSeparator />
      <DropdownMenuItem as="a" :href="`/problems/${slug}`"> View details </DropdownMenuItem>
      <DropdownMenuItem @click="copy(problem.name)"> Copy name </DropdownMenuItem>
      <DropdownMenuItem> Copy citation </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="downloadDataset(problem)">
        Download dataset <code>50mb</code></DropdownMenuItem
      >
      <DropdownMenuItem @click="downloadPython(problem)">Download Python</DropdownMenuItem>
      <DropdownMenuItem @click="downloadMatLab(problem)">Download MatLab</DropdownMenuItem>
      <DropdownMenuItem @click="downloadJulia(problem)">Download Julia</DropdownMenuItem>
      <DropdownMenuItem @click="downloadAMPL(problem)">Download AMPL</DropdownMenuItem>
      <DropdownMenuItem @click="downloadGAMS(problem)">Download GAMS</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
