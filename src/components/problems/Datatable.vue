<script setup lang="ts">
import type {
  Column,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table';
import { slugify, valueUpdater } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-vue-next';
import { h, ref } from 'vue';
import type { Category, Problem } from '@/types';
import ActionMenu from './ActionMenu.vue';
import DataTableToolbar from './DataTableToolbar.vue';
import type { Dataset } from '@/lib/types';
import CategoryTag from '../CategoryTag.vue';

const props = defineProps<{
  problems: Problem[];
}>();

const columnHelper = createColumnHelper<Problem>();

const sortableHeader = <A, B>(column: Column<A, B>, header: string, tooltip?: string) => {
  return h(
    Button,
    {
      variant: 'ghost',
      title: tooltip,
      onClick: () => {
        if (!column.getIsSorted()) {
          column.toggleSorting(false);
        } else if (column.getIsSorted() === 'asc') {
          column.toggleSorting(true);
        } else {
          column.clearSorting();
        }
      },
    },
    () => [
      header,
      h(
        column.getIsSorted() === false
          ? ChevronsUpDown
          : column.getIsSorted() === 'asc'
            ? ChevronUp
            : ChevronDown,
        { class: 'ml-2 h-4 w-4' }
      ),
    ]
  );
};

const columns = [
  columnHelper.accessor('name', {
    header: ({ column }) => sortableHeader(column, 'Name'),
    cell: ({ row }) => {
      const name = row.getValue('name') as string;

      return h(Button, { variant: 'link', asChild: true }, () =>
        h('a', { href: `/problems/${slugify(name)}` }, name)
      );
    },
    enableHiding: false,
  }),
  columnHelper.accessor('category', {
    header: ({ column }) => sortableHeader(column, 'Category'),
    cell: ({ row }) => {
      const category = row.getValue('category') as Category;

      return h(CategoryTag, { category, subcategory: row.original.subcategory });
    },
    enableHiding: false,
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId) as Category;

      return value.some((v) => rowValue.name.toLowerCase().includes(v.toLowerCase()));
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as Category;
      const b = rowB.getValue(columnId) as Category;
      // Sort by category name first, then subcategory
      const nameCompare = a.name.localeCompare(b.name);
      if (nameCompare !== 0) return nameCompare;
      const subA = rowA.original.subcategory ?? '';
      const subB = rowB.original.subcategory ?? '';
      return subA.localeCompare(subB);
    },
  }),
  columnHelper.accessor('dimension.x', {
    header: ({ column }) => sortableHeader(column, 'x', 'Upper-level decision variables'),
  }),
  columnHelper.accessor('dimension.y', {
    header: ({ column }) => sortableHeader(column, 'y', 'Lower-level decision variables'),
  }),
  columnHelper.accessor('dimension.F', {
    header: ({ column }) => sortableHeader(column, 'F(x,y)', 'Upper-level objective function'),
  }),
  columnHelper.accessor('dimension.f', {
    header: ({ column }) => sortableHeader(column, 'f(x,y)', 'Lower-level objective function'),
  }),
  columnHelper.accessor('dimension.G', {
    header: ({ column }) =>
      sortableHeader(column, 'G(x,y)', 'Upper-level inequality constraint functions'),
  }),
  columnHelper.accessor('dimension.g', {
    header: ({ column }) =>
      sortableHeader(column, 'g(x,y)', 'Lower-level inequality constraint functions'),
  }),
  columnHelper.accessor('dimension.H', {
    header: ({ column }) =>
      sortableHeader(column, 'H(x,y)', 'Upper-level equality constraint functions'),
  }),
  columnHelper.accessor('dimension.h', {
    header: ({ column }) =>
      sortableHeader(column, 'h(x,y)', 'Lower-level equality constraint functions'),
  }),
  columnHelper.accessor('datasets', {
    header: () => 'Datasets',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-sm text-muted-foreground text-wrap leading-8' },
        (row.getValue('datasets') as undefined | Dataset[])?.map((d) => d.name)?.join(', ')
      ),
  }),
  columnHelper.accessor('solution.optimality', {
    header: 'Solution Optimality',
  }),
  columnHelper.accessor('added', {
    header: ({ column }) => sortableHeader(column, 'Added', 'Date when the problem was added'),
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-sm text-muted-foreground' },
        (row.getValue('added') as Date).toLocaleDateString('en-GB')
      ),
  }),
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) =>
      h(ActionMenu, {
        problem: row.original,
      }),
  },
];

const sorting = ref<SortingState>([
  {
    id: 'name',
    desc: false,
  },
]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({
  datasets: false,
  dimension_F: false,
  dimension_f: false,
  dimension_G: false,
  dimension_g: false,
  dimension_H: false,
  dimension_h: false,
  solution_optimality: false,
});

const table = useVueTable({
  data: props.problems,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
  },
});
</script>

<template>
  <div class="w-full">
    <DataTableToolbar :table="table" />

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow>
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center"> No results. </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div
        class="text-muted-foreground flex-1 text-sm"
        v-if="
          table.getFilteredRowModel().rows.length !== table.getPreFilteredRowModel().rows.length
        "
      >
        {{ table.getFilteredRowModel().rows.length }} of
        {{ table.getPreFilteredRowModel().rows.length }} problems
      </div>

      <slot name="bottom-right" />
    </div>
  </div>
</template>
