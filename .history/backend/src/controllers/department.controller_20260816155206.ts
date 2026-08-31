import { Request, Response } from "express";

import {
  createDepartmentIntoDB,
  getAllDepartmentsFromDB,
} from "../services/department.service";

export const createDepartment = async (
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

    const result = await createDepartmentIntoDB(
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
        error.message || "Failed to create department",
    });
  }
};

export const getAllDepartments = async (
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

    const result =
      await getAllDepartmentsFromDB(
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
        error.message ||
        "Failed to fetch departments",
    });
  }
};