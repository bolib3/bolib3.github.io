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
import { ChevronDown, X } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/categories';
import { computed } from 'vue';

interface DataTableToolbarProps {
  table: Table<Problem>;
}

const props = defineProps<DataTableToolbarProps>();

const categoryOptions = Object.values(categories).map((category) => ({
  label: category.name,
  value: category.name,
  colour: category.colour,
}));

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0);
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 py-4">
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
    <Button
      v-if="isFiltered"
      variant="ghost"
      class="h-8 px-2 lg:px-3"
      @click="table.resetColumnFilters()"
    >
      Reset
      <X class="ml-2 h-4 w-4" />
    </Button>

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
