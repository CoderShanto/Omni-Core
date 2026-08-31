import { Request, Response } from "express";

import {
  createPositionIntoDB,
  getAllPositionsFromDB,
} from "../services/position.service";

export const createPosition = async (
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
      await createPositionIntoDB(
        req.body,
        req.user.companyId
      );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create position",
    });
  }
};

export const getAllPositions = async (
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
      await getAllPositionsFromDB(
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
        "Failed to fetch positions",
    });
  }
};