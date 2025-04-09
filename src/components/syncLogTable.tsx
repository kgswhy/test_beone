'use client'

import * as React from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export type SyncLog = {
    id: string
    source_system: string
    target_system: string
    action: string
    status: string
    payload: {
      id: string
      created_at: string
      customer_id: string
      crm_point_id: string | null
      total_amount: string
      erp_invoice_id: string | null
      payment_method: string
      pos_transaction_id: string | null
      points_earned: number 
    }
    response: Record<string, any>
    created_at: string
    customer_name: string
    customer_phone: string
  }
  

interface SyncLogTableProps {
  data: SyncLog[]
}

export const columns: ColumnDef<SyncLog>[] = [
  {
    header: '#',
    cell: ({ row }) => (
      <div className="text-sm font-medium text-muted-foreground">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: 'source_system',
    header: 'Source',
  },
  {
    accessorKey: 'target_system',
    header: 'Target',
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue('action')}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const isSuccess = status === 'success'
      const isFailed = status === 'failed'

      return (
        <Badge
          variant={isSuccess ? 'secondary' : isFailed ? 'destructive' : 'outline'}
          className="flex items-center gap-1 px-2.5 py-1.5"
        >
          {isSuccess && <CheckCircle2 size={16} className="text-green-500" />}
          {isFailed && <XCircle size={16} className="text-red-500" />}
          <span className="capitalize">{status}</span>
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      const formatted = date.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      return <span suppressHydrationWarning>{formatted}</span>
    },
  },
  {
    accessorKey: 'payload',
    header: 'Invoice',
    cell: ({ row }) => {
      const [loading, setLoading] = React.useState(false)
      const { payload, customer_name, customer_phone, id, created_at, action } = row.original
  
      const handleGeneratePDF = () => {
        setLoading(true)
  
        const doc = new jsPDF()
  
        // Header
        doc.setFillColor(41, 128, 185)
        doc.rect(0, 0, 210, 30, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(20)
        doc.text('INVOICE', 14, 20)
  
        // Company Info
        doc.setFontSize(10)
        doc.setTextColor(0)
        doc.text('PT. Middleware Integrasi', 150, 10, { align: 'right' })
        doc.text('Jakarta, Indonesia', 150, 15, { align: 'right' })
        doc.text('middleware@example.com', 150, 20, { align: 'right' })
  
        // Customer & Order Info
        doc.setFontSize(12)
        doc.text(`Invoice Date: ${new Date(created_at).toLocaleDateString()}`, 14, 40)
        doc.text(`Invoice ID: ${id}`, 14, 48)
        doc.text(`Customer Name: ${customer_name}`, 14, 56)
        doc.text(`Phone: ${customer_phone}`, 14, 64)
  
        // Invoice Body
        const body = [
          ['Total Amount', `IDR ${parseFloat(payload.total_amount).toFixed(2)}`],
          ['Payment Method', payload.payment_method],
        ]
  
        // ✅ Tambahkan points_earned jika action-nya "update"
        if (action?.toUpperCase().includes('UPDATE') && payload.points_earned !== undefined) {
            body.push(['Points Earned', `+${payload.points_earned}`])
          }
          
  
        // Item Table
        autoTable(doc, {
          startY: 75,
          head: [['Item', 'Amount']],
          body: body,
          theme: 'striped',
          styles: { fontSize: 12 },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
          },
          columnStyles: {
            0: { cellWidth: 90 },
            1: { cellWidth: 90, halign: 'right' },
          },
        })
  
        // Footer
        doc.setFontSize(10)
        doc.text('Thank you for your business!', 105, doc.internal.pageSize.getHeight() - 10, {
          align: 'center',
        })
  
        doc.save(`invoice-${id}.pdf`)
        setLoading(false)
      }
  
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleGeneratePDF} size="sm" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'PDF'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate invoice PDF</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: 'points_earned',
    header: 'Points',
    cell: ({ row }) => {
      const payload = row.original.payload
      const points = payload?.points_earned
  
      if (points !== undefined && points !== null) {
        return <span className="font-medium text-green-600">+{points}</span>
      }
  
      return <span className="text-gray-400">-</span> // kalau nggak ada point
    }
  }
  
  
]

export default function SyncLogTable({ data }: SyncLogTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-x-auto px-4 lg:px-8 py-6 w-full">
      <div className="border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-muted-foreground text-sm">
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
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/40 transition-colors duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
