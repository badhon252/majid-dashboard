import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAllPayments,
  getMyPayments,
  createPaymentSession,
} from "../api/payments.api";

export function useAllPayments() {
  return useQuery({
    queryKey: ["all-payments"],
    queryFn: getAllPayments,
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: ["my-payments"],
    queryFn: getMyPayments,
  });
}

export function useCreatePaymentSession() {
  return useMutation({
    mutationFn: createPaymentSession,
  });
}
