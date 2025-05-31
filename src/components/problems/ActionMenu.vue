<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { downloadFile, formatBytes, snakeCase } from '@/lib/utils';
import type { Problem } from '@/types';
import { MoreHorizontal, Radical, Table } from 'lucide-vue-next';
import { computed } from 'vue';
import { slugify } from '../../lib/utils';
import type { Dataset } from '@/types';
import { Download } from 'lucide-vue-next';

const props = defineProps<{
  problem: Problem;
}>();

const slug = computed(() => slugify(props.problem.name));

function copy(text: string) {
  navigator.clipboard.writeText(text);
}

function downloadDataset(dataset: Dataset) {
  downloadFile('/sample/bilevel.csv', snakeCase(dataset.name));
}

function downloadPython(problem: Problem) {
  downloadFile('/sample/bilevel.py', snakeCase(problem.name) + '.py');
}

function downloadMatLab(problem: Problem) {
  downloadFile('/sample/bilevel.m', snakeCase(problem.name) + '.m');
}

function downloadGAMS(problem: Problem) {
  downloadFile('/sample/bilevel.gms', snakeCase(problem.name) + '.gms');
}

function downloadLaTeX(problem: Problem) {
  downloadFile('/sample/bilevel.tex', snakeCase(problem.name) + '.tex');
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

      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Radical class="mr-2 h-4 w-4" />
          <span class="mr-2">Download problem</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem @click="downloadPython(problem)">
              <Download /> Python
            </DropdownMenuItem>
            <DropdownMenuItem @click="downloadMatLab(problem)">
              <Download /> MatLab
            </DropdownMenuItem>
            <DropdownMenuItem @click="downloadGAMS(problem)"><Download /> GAMS</DropdownMenuItem>
            <DropdownMenuItem @click="downloadLaTeX(problem)"><Download /> LaTeX</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>

      <DropdownMenuSub v-if="problem.datasets">
        <DropdownMenuSubTrigger>
          <Table class="mr-2 h-4 w-4" />
          <span class="mr-2">Download datasets</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              v-for="dataset in problem.datasets"
              :key="dataset.name"
              @click="downloadDataset(dataset)"
            >
              <Download />
              {{ dataset.name }}

              <code class="text-muted-foreground text-xs">
                -
                {{ formatBytes(dataset.size) }}
              </code>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
