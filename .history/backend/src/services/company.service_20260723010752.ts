import Company from "../models/Company";
import { ICompany } from "../interfaces/company.interface";

export const createCompanyIntoDB = async (
  payload: ICompany
) => {
  const result = await Company.create(payload);

  return result;
};

export const getAllCompaniesFromDB =
  async () => {
    const result = await Company.find();

    return result;
  };