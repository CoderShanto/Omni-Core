import api from "./api";

export const getCompanies = async () => {
  const res = await api.get("/companies");

  return res.data.data;
};