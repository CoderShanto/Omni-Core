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
    if (!req.user.companyId) {
      return res.status(400).json({
        success: false,
        message: "Company information is missing",
      });
    }

    const result = await createEmployeeIntoDB(
      req.body,
      req.user.companyId
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Failed to create employee",
    });
  }
};

export const getAllEmployees = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user.companyId) {
      return res.status(400).json({
        success: false,
        message: "Company information is missing",
      });
    }

    const result = await getAllEmployeesFromDB(
      req.user.companyId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Failed to fetch employees",
    });
  }
};