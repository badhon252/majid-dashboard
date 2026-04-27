import { api } from "@/lib/api";

export const getChartData = async (filter?: string) => {
  const response = await api.get("/dashboard/chart", {
    params: { filter },
  });
  return response.data;
};
