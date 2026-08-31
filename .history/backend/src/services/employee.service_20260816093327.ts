import Employee from "../models/Employee";
import { IEmployee } from "../interfaces/employee.interface";

export const createEmployeeIntoDB = async (
  payload: Omit<IEmployee, "companyId">,
  companyId: string
) => {
  const result = await Employee.create({
    ...payload,
    companyId,
  });

  return result;
};

export const getAllEmployeesFromDB = async (
  companyId: string
) => {
  const result = await Employee.find({
    companyId,
  })
    .populate("user", "name email role")
    .populate("companyId", "name industry")
    .populate("department", "name")
    .populate("position", "name level");

  return result;
};