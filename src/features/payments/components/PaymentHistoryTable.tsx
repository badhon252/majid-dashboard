"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { TransactionDetailsModal } from "./TransactionDetailsModal";

import { useAllPayments } from "../hooks/usePayments";

export interface Payment {
  id: string;
  user: string;
  amount: string;
  date: string;
  status: "PAID" | "PENDING";
}

interface PaymentApiRecord {
  _id: string;
  user?: {
    firstName?: string;
    lastName?: string;
  };
  amount: number;
  createdAt: string;
  status: string;
}

export function PaymentHistoryTable() {
  const [page, setPage] = useState(1);
  const { data: paymentsData, isLoading } = useAllPayments();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Payment | null>(null);

  const payments: Payment[] =
    paymentsData?.data?.map((p: PaymentApiRecord) => ({
      id: p._id.substring(0, 8).toUpperCase(),
      user: p.user?.firstName
        ? `${p.user.firstName} ${p.user.lastName}`
        : "Unknown User",
      amount: `$${p.amount.toFixed(2)}`,
      date: new Date(p.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: p.status === "completed" ? "PAID" : "PENDING",
    })) || [];

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "id",
      header: "TRANSACTION ID",
      cell: ({ row }) => (
        <span className="text-blue-500 font-medium">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: "user",
      header: "USER",
    },
    {
      accessorKey: "amount",
      header: "AMOUNT",
      cell: ({ row }) => (
        <span className="font-bold">{row.original.amount}</span>
      ),
    },
    {
      accessorKey: "date",
      header: "DATE",
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "rounded-md px-3 py-1 font-semibold text-[10px]",
            row.original.status === "PAID"
              ? "bg-green-100 text-green-600 hover:bg-green-100"
              : "bg-orange-100 text-orange-600 hover:bg-orange-100",
          )}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:text-primary"
            onClick={() => setSelectedTransaction(row.original)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:text-primary"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable columns={columns} data={payments} isLoading={isLoading} />
      <div className="flex items-center justify-center mt-8">
        <Pagination
          currentPage={page}
          totalPages={paymentsData?.meta?.totalPages || 1}
          onPageChange={setPage}
        />
      </div>

      <TransactionDetailsModal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transactionData={selectedTransaction}
      />
    </div>
  );
}
