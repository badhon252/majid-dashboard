import { useQuery } from "@tanstack/react-query";
import { getChartData } from "../api/dashboard.api";

export function useDashboardChart(filter?: string) {
  return useQuery({
    queryKey: ["dashboard-chart", filter],
    queryFn: () => getChartData(filter),
  });
}
