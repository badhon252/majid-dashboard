import { api } from "@/lib/api";

export const getAllInvoices = async () => {
  const response = await api.get("/payment/all-payments");
  return response.data;
};

export const getMyInvoices = async () => {
  const response = await api.get("/payment/my-payments");
  return response.data;
};

export const getInvoiceById = async (id: string) => {
  // Assuming we can fetch a single payment record
  const response = await api.get(`/payment/${id}`);
  return response.data;
};
