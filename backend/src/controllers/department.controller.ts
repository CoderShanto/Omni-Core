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
    const result = await createDepartmentIntoDB(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create department",
    });
  }
};

export const getAllDepartments = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getAllDepartmentsFromDB();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
    });
  }
};