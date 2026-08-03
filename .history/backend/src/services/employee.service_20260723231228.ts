import Employee from "../models/Employee";
import { IEmployee } from "../interfaces/employee.interface";

export const createEmployeeIntoDB = async (
  payload: IEmployee
) => {
  const result = await Employee.create(payload);

  return result;
};

export const getAllEmployeesFromDB = async () => {
  const result = await Employee.find()
    .populate("user", "name email role")
.populate("company", "name industry")
.populate("department", "name")
.populate("position", "name level");

  return result;
};