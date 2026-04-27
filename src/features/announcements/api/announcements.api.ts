import { api } from "@/lib/api";

export const getAllAnnouncements = async () => {
  const response = await api.get("/notification");
  return response.data;
};

export const markAllRead = async () => {
  const response = await api.patch("/notification/read/all");
  return response.data;
};
