'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'

export type Point = {
  id: string
  customer_id: string
  transaction_id: string
  points_earned: number
  points_redeemed: number
  total_points: number
  created_at: string
}

interface PointsTableProps {
  data: Point[]
}

export const pointColumns: ColumnDef<Point>[] = [
  {
    header: '#',
    cell: ({ row }) => <div className="text-sm font-medium">{row.index + 1}</div>,
  },
  {
    accessorKey: 'customer_id',
    header: 'Customer ID',
  },
  {
    accessorKey: 'transaction_id',
    header: 'Transaction ID',
  },
  {
    accessorKey: 'points_earned',
    header: 'Earned',
  },
  {
    accessorKey: 'points_redeemed',
    header: 'Redeemed',
  },
  {
    accessorKey: 'total_points',
    header: 'Total',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <span suppressHydrationWarning>
          {date.toISOString().split('T').join(' ').slice(0, 19)}
        </span>
      )
    },
  },
]

export default function PointsTable({ data }: PointsTableProps) {
  const table = useReactTable({
    data,
    columns: pointColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-1">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={pointColumns.length} className="text-center">
                No point data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
