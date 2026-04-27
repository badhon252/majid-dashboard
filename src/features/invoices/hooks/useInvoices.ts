import { useQuery } from "@tanstack/react-query";
import {
  getAllInvoices,
  getMyInvoices,
  getInvoiceById,
} from "../api/invoices.api";

export function useInvoices(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: () => getAllInvoices(),
  });
}

export function useMyInvoices() {
  return useQuery({
    queryKey: ["my-invoices"],
    queryFn: getMyInvoices,
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id),
    enabled: !!id,
  });
}
