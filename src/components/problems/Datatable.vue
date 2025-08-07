<script setup lang="ts">
import type {
  Column,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table';
import { distinct, slugify, valueUpdater } from '@/lib/utils';
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
import { ChevronDown, ChevronsUpDown, ChevronUp, ArrowRight } from 'lucide-vue-next';
import { h, ref } from 'vue';
import type { Category, Problem, ProblemVariant } from '@/types';
import ActionMenu from './ActionMenu.vue';
import DataTableToolbar from './DataTableToolbar.vue';
import CategoryTag from '../CategoryTag.vue';

const props = defineProps<{
  problems: Problem[];
}>();

const columnHelper = createColumnHelper<Problem>();

const basicHeader = (header: string, tooltip: string) => () => h('div', { title: tooltip }, header);

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

const variantPropertyRange = (
  variants: Problem['variants'],
  property: keyof Problem['variants'][0]['dimension']
) => {
  const values = variants.map((v) => v.dimension[property]);
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return h('span', {}, min);
  }

  return h('div', { class: 'flex items-center gap-1' }, [
    h('span', {}, min),
    h(ArrowRight, { class: 'size-4' }),
    h('span', {}, max),
  ]);
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
    filterFn: (row, columnId, value: string[]) => {
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
  columnHelper.display({
    id: 'datasets',
    header: ({ column }) =>
      sortableHeader(column, '# Datasets', 'Number of datasets associated with the problem'),
    cell: ({ row }) => {
      const count = (row.original.variants as ProblemVariant[]).length;

      // Problems with only one variant will not be parameterized, so there are no datasets
      return count <= 1
        ? h('span', { class: 'text-sm text-muted-foreground' }, '-')
        : h('div', {}, count);
    },
  }),
  columnHelper.display({
    id: 'dimension_x',
    header: basicHeader('x', 'Upper-level decision variables'),
    cell: ({ row }) => variantPropertyRange(row.original.variants, 'x'),
  }),
  columnHelper.display({
    id: 'dimension_y',
    header: basicHeader('y', 'Lower-level decision variables'),
    cell: ({ row }) => variantPropertyRange(row.original.variants, 'y'),
  }),
  columnHelper.display({
    id: 'dimension_F',
    header: basicHeader('F(x,y)', 'Upper-level objective function'),
    cell: ({ row }) => variantPropertyRange(row.original.variants, 'F'),
  }),
  columnHelper.display({
    id: 'dimension_f',
    header: basicHeader('f(x,y)', 'Lower-level objective function'),
    cell: ({ row }) => variantPropertyRange(row.original.variants, 'f'),
  }),
  columnHelper.display({
    id: 'dimension_G',
    header: basicHeader('G(x,y)', 'Upper-level inequality constraint functions'),
    cell: ({ row }) => variantPropertyRange(row.original.variants, 'G'),
  }),
  columnHelper.display({
    id: 'dimension_g',
    header: basicHeader('g(x,y)', 'Lower-level inequality constraint functions'),
    cell: ({ row }) => variantPropertyRange(row.original.variants, 'g'),
  }),
  columnHelper.display({
    id: 'dimension_H',
    header: basicHeader('H(x,y)', 'Upper-level equality constraint functions'),
    cell: ({ row }) => variantPropertyRange(row.original.variants, 'H'),
  }),
  columnHelper.display({
    id: 'dimension_h',
    header: basicHeader('h(x,y)', 'Lower-level equality constraint functions'),
    cell: ({ row }) => variantPropertyRange(row.original.variants, 'h'),
  }),
  columnHelper.display({
    id: 'solution_optimality',
    header: 'Solution Optimality',
    cell: ({ row }) => {
      const variants = row.original.variants as ProblemVariant[];

      const values = distinct(variants.map((v) => v.solution.optimality));
      return h('span', {}, values.join(', '));
    },
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
  columnHelper.display({
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) =>
      h(ActionMenu, {
        problem: row.original,
      }),
  }),
];

const sorting = ref<SortingState>([
  {
    id: 'name',
    desc: false,
  },
]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({
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
