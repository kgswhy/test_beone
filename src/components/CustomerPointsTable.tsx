'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type CustomerPoint = {
  customer_id: number
  customer_name: string
  phone: string
  total_points: number
  transaction_ids: number[]
}

type Props = {
  data: CustomerPoint[]
}



export default function CustomerPointsTable({ data }: Props) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-semibold">🎯 Customer Points Overview</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto px-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-center">Points</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const pointLevel = item.total_points > 1000
                ? "high"
                : item.total_points > 500
                  ? "medium"
                  : "low"

              return (
                <TableRow
                  key={item.customer_id}
                  className="transition-all hover:bg-accent/40 cursor-pointer"
                >
                  <TableCell>{index + 1}</TableCell> 
                  <TableCell>{item.customer_name}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={pointLevel === "high" ? "destructive" : pointLevel === "medium" ? "default" : "secondary"}
                      className="px-3 py-1"
                    >
                      {item.total_points} pts
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {item.transaction_ids.length} transaksi
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => alert(`Detail for ${item.customer_name}`)}
                    >
                      Detail
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
