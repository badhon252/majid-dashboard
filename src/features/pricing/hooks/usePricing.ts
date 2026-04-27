import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
} from "../api/pricing.api";

export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: getAllSubscriptions,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}
