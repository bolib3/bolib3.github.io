<script setup lang="ts">
import type { Table } from '@tanstack/vue-table';
import type { Problem } from '@/types';
import DataTableFacetedFilter from './DataTableFacetedFilter.vue';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { categories } from '@/assets/sample';

interface DataTableToolbarProps {
  table: Table<Problem>;
}

const props = defineProps<DataTableToolbarProps>();

const categoryOptions = Object.values(categories).map((category) => ({
  label: category.name,
  value: category.name,
  colour: category.colour,
}));
</script>

<template>
  <div class="flex items-center gap-2 py-4">
    <Input
      class="max-w-sm"
      placeholder="Search..."
      :model-value="table.getColumn('name')?.getFilterValue() as string"
      @update:model-value="table.getColumn('name')?.setFilterValue($event)"
    />
    <DataTableFacetedFilter
      title="Categories"
      :column="table.getColumn('category')"
      :options="categoryOptions"
    />
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" class="ml-auto">
          Columns <ChevronDown class="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
          :key="column.id"
          class="capitalize"
          :model-value="column.getIsVisible()"
          @update:model-value="
            (value) => {
              column.toggleVisibility(!!value);
            }
          "
        >
          {{ column.id }}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
