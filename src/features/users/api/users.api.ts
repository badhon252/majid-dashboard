import { api } from "@/lib/api";

export const getAllUsers = async () => {
  const response = await api.get("/user/all-users");
  return response.data;
};

export const getMyProfile = async () => {
  const response = await api.get("/user/my-profile");
  return response.data;
};

export const updateProfile = async (
  data: FormData | Record<string, unknown>,
) => {
  const response = await api.put("/user/update-profile", data);
  return response.data;
};

export const changePassword = async (data: Record<string, unknown>) => {
  const response = await api.post("/auth/change-password", data);
  return response.data;
};
