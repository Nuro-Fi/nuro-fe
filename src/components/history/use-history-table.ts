"use no memo";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import type { HistoryItem } from "@/hooks/graphql/use-history";

const PAGE_SIZE = 10;

const columns: ColumnDef<HistoryItem>[] = [
  {
    id: "item",
    header: () => null,
    cell: ({ row }) => row.original,
  },
];

export const useHistoryTable = (items: HistoryItem[], customPageSize?: number) => {
  return useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: customPageSize ?? PAGE_SIZE,
        pageIndex: 0,
      },
    },
  });
};
