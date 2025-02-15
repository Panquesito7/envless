import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import Filters from "./Filters";

export type FilterOption = {
  label: string;
  value: string;
  order?: string;
};

export type FilterOptions = {
  [key: string]: FilterOption[];
};
interface TableProps<T extends object> {
  data: T[];
  hasFilters?: boolean;
  variant?: "dark" | "darker";
  columns: ColumnDef<T>[];
  visibleColumns?: VisibilityState | undefined;
  filterOptions?: FilterOptions;
}

export function Table<T extends object>({
  visibleColumns = {},
  hasFilters = true,
  variant = "dark",
  data,
  columns,
  filterOptions,
}: TableProps<T>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
    initialState: {
      columnVisibility: visibleColumns,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugAll: true,
  });

  return (
    <div className="inline-block min-w-full py-4 align-middle">
      <div className="overflow-hidden shadow ring-1 ring-darker ring-opacity-5 md:rounded">
        {hasFilters && (
          <div className="min-w-full rounded-t bg-darker pt-3">
            <Filters
              filterOptions={filterOptions}
              columnFilters={columnFilters}
              table={table}
            />
          </div>
        )}
        <table className="min-w-full divide-y divide-light">
          <tbody
            className={clsx({
              "bg-dark": variant === "dark",
              "bg-darker": variant === "darker",
            })}
          >
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
