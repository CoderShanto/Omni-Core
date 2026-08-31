import Employee from "../models/Employee";
import User from "../models/User";
import Department from "../models/Department";
import Position from "../models/Position";

import { IEmployee } from "../interfaces/employee.interface";

export const createEmployeeIntoDB = async (
  payload: Omit<IEmployee, "companyId">,
  companyId: string
) => {
  // 1. Check user belongs to authenticated company
  const user = await User.findOne({
    _id: payload.user,
    companyId,
  });

  if (!user) {
    throw new Error(
      "User does not belong to your company"
    );
  }

  // 2. Check department belongs to authenticated company
  const department = await Department.findOne({
    _id: payload.department,
    companyId,
  });

  if (!department) {
    throw new Error(
      "Department does not belong to your company"
    );
  }

  // 3. Check position belongs to authenticated company
  const position = await Position.findOne({
    _id: payload.position,
    companyId,
  });

  if (!position) {
    throw new Error(
      "Position does not belong to your company"
    );
  }

  // 4. Create employee using companyId
  // from authenticated JWT
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