import Department from "../models/Department";
import { IDepartment } from "../interfaces/department.interface";

export const createDepartmentIntoDB = async (
  payload: IDepartment
) => {
  const result = await Department.create(payload);

  return result;
};

export const getAllDepartmentsFromDB =
  async () => {
    const result = await Department.find()
      .populate("company", "name industry");

    return result;
  };