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
import type { Problem } from '@/types';
import { MoreHorizontal } from 'lucide-vue-next';

defineProps<{
  problem: Problem;
}>();

function copy(text: string) {
  navigator.clipboard.writeText(text);
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
      <DropdownMenuItem>Download dataset <code>50mb</code></DropdownMenuItem>
      <DropdownMenuItem>Download Python</DropdownMenuItem>
      <DropdownMenuItem>Download MatLab</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
