<script setup lang="ts">
import type { Category } from '@/types';
import { Badge } from '@/components/ui/badge';

defineProps<{
  category: Category;
}>();
</script>

<template>
  <Badge variant="outline" class="text-black" :style="{ backgroundColor: category.colour }">
    {{ category.name }}
  </Badge>
</template>
