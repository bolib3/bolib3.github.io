<script setup lang="ts">
import type {
  Column,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table';
import { cn, valueUpdater } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { problems } from '@/assets/sample';
import type { Citation, Problem } from '@/types';
import ActionMenu from './ActionMenu.vue';

const data = problems;

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
    cell: ({ row }) => h('div', {}, row.getValue('name')),
    enableHiding: false,
  }),
  columnHelper.accessor('category', {
    header: ({ column }) => sortableHeader(column, 'Category'),
    // TODO: Nested categories
    cell: ({ row }) => {
      const category = row.getValue('category') as Category;

      return h(
        Badge,
        { variant: 'outline', style: { backgroundColor: category.colour } },
        category.name
      );
    },
    enableHiding: false,
  }),
  columnHelper.accessor('upperLevelVariables', {
    header: ({ column }) => sortableHeader(column, 'n', 'Upper Level Variables'),
    cell: ({ row }) => h('code', {}, row.getValue('upperLevelVariables')),
  }),
  columnHelper.accessor('lowerLevelVariables', {
    header: ({ column }) => sortableHeader(column, 'm', 'Lower Level Variables'),
    cell: ({ row }) => h('code', {}, row.getValue('lowerLevelVariables')),
  }),
  columnHelper.accessor('upperLevelConstraints', {
    header: ({ column }) => sortableHeader(column, 'p', 'Upper Level Constraints'),
    cell: ({ row }) => h('code', {}, row.getValue('upperLevelConstraints')),
  }),
  columnHelper.accessor('lowerLevelConstraints', {
    header: ({ column }) => sortableHeader(column, 'q', 'Lower Level Constraints'),
    cell: ({ row }) => h('code', {}, row.getValue('lowerLevelConstraints')),
  }),
  columnHelper.accessor('citation', {
    header: ({ column }) => sortableHeader(column, 'Citation'),
    cell: ({ row }) => {
      const citation = row.getValue('citation') as Citation | undefined;

      if (!citation) {
        return h('div', { class: 'text-muted' }, '-');
      }

      return h(
        Button,
        { variant: 'link', asChild: true },
        h(
          'a',
          { href: citation.link, target: '_blank' },
          [citation.authors, citation.year].join(' ')
        )
      );
    },
  }),
  columnHelper.accessor('addedAt', {
    header: ({ column }) => sortableHeader(column, 'Added'),
    cell: ({ row }) => h('div', {}, (row.getValue('addedAt') as Date).toLocaleDateString()),
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
  addedAt: false,
});

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
    get columnVisibility() {
      return columnVisibility.value;
    },
  },
});
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-2 py-4">
      <Input
        class="max-w-sm"
        placeholder="Search..."
        :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value="table.getColumn('name')?.setFilterValue($event)"
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
    </div>
  </div>
</template>
