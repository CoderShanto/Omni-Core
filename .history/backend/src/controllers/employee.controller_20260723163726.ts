import { Request, Response } from "express";
import {
  createEmployeeIntoDB,
  getAllEmployeesFromDB,
} from "../services/employee.service";

export const createEmployee = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await createEmployeeIntoDB(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create employee",
    });
  }
};

export const getAllEmployees = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getAllEmployeesFromDB();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
};