import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllAnnouncements, markAllRead } from "../api/announcements.api";

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: getAllAnnouncements,
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
