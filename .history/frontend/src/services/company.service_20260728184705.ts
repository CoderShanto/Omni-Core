import api from "./api";

export const getCompanies = async () => {
  const res = await api.get("/companies");
  return res.data.data;
};

export const createCompany = async (data: any) => {
  const res = await api.post("/companies", data);
  return res.data.data;
};