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
    const result = await createPositionIntoDB(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create position",
    });
  }
};

export const getAllPositions = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getAllPositionsFromDB();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch positions",
    });
  }
};