import Department from "../models/Department";
import { IDepartment } from "../interfaces/department.interface";

export const createDepartmentIntoDB = async (
  payload: Omit<IDepartment, "companyId">,
  companyId: string
) => {
  const result = await Department.create({
    ...payload,
    companyId,
  });

  return result;
};

export const getAllDepartmentsFromDB = async (
  companyId: string
) => {
  const result = await Department.find({
    companyId,
  }).populate("companyId", "name industry");

  return result;
};