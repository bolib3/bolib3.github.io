<script setup lang="ts">
import type { Category } from '@/types';
import { Badge } from '@/components/ui/badge';

defineProps<{
  category: Category;
  subcategory: string | null;
}>();
</script>

<template>
  <Badge variant="outline" class="text-black" :style="{ backgroundColor: category.colour }">
    {{ category.name }}
    <template v-if="subcategory"> / {{ subcategory }} </template>
  </Badge>
</template>
