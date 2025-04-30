<script setup lang="ts">
import type { Column, ColumnFiltersState, SortingState } from '@tanstack/vue-table';
import { downloadFile, formatBytes, slugify, valueUpdater } from '@/lib/utils';
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
import { ChevronDown, ChevronsUpDown, ChevronUp, Download } from 'lucide-vue-next';
import { h, ref } from 'vue';
import type { Dataset } from '@/types';
import { datasets } from '@/lib/datasets';
import Input from '../ui/input/Input.vue';
import { problems } from '@/lib/problems';

const data = datasets;

const columnHelper = createColumnHelper<Dataset>();

function downloadDataset(name: string) {
  downloadFile('/sample/bilevel.csv', slugify(name) + '.csv');
}

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
    cell: ({ getValue }) => {
      const name = getValue() as string;
      return h('span', { class: 'ml-2' }, name);
    },
  }),
  columnHelper.accessor('size', {
    header: ({ column }) => sortableHeader(column, 'Size'),
    cell: ({ getValue }) => {
      const size = getValue() as number;
      return formatBytes(size);
    },
  }),
  {
    id: 'problems',
    header: 'Problems',
    cell: ({ row }) => {
      const name = row.getValue('name') as string;

      // TODO: Lets do this somewhere else
      const relatedProblem =
        problems.filter((problem) => problem.datasets?.some((dataset) => dataset.name === name)) ??
        [];

      return h(
        'div',
        { class: 'flex flex-wrap gap-1' },
        relatedProblem.map((problem) => {
          return h(
            Button,
            { variant: 'link', class: 'text-muted-foreground px-1', asChild: true },
            () => h('a', { href: `/problems/${slugify(problem.name)}` }, problem.name)
          );
        })
      );
    },
  },
  {
    id: 'download',
    header: 'Download',
    cell: ({ row }) => {
      return h(
        Button,
        { variant: 'link', onClick: () => downloadDataset(row.getValue('name')) },
        () => h(Download)
      );
    },
  },
];

const sorting = ref<SortingState>([
  {
    id: 'name',
    desc: false,
  },
]);
const columnFilters = ref<ColumnFiltersState>([]);

const table = useVueTable({
  data,
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
  },
});
</script>

<template>
  <div class="mt-6 w-full">
    <div class="py-4">
      <Input
        class="max-w-sm"
        placeholder="Search..."
        :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value="table.getColumn('name')?.setFilterValue($event)"
      />
    </div>

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
  </div>
</template>
