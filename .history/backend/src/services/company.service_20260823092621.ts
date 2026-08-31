import Company from "../models/Company";
import { ICompany } from "../interfaces/company.interface";

export const createCompanyIntoDB = async (
  payload: ICompany
) => {
  const result = await Company.create(payload);

  return result;
};

export const getAllCompaniesFromDB = async () => {
  const result = await Company.find()
    .populate("owner", "name email");

  return result;
};

export const getSingleCompanyFromDB = async (
  id: string
) => {
  const result = await Company.findById(id)
    .populate("owner", "name email");

  return result;
};

export const updateCompanyIntoDB = async (
  id: string,
  payload: Partial<ICompany>
) => {
  const result = await Company.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    }
  ).populate("owner", "name email");

  return result;
};

export const deleteCompanyFromDB = async (
  id: string
) => {
  const result = await Company.findByIdAndDelete(id);

  return result;
};