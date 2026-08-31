import { Request, Response } from "express";

import {
  createTeamIntoDB,
  getAllTeamsFromDB,
} from "../services/team.service";

export const createTeam = async (
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

    const result = await createTeamIntoDB(
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
        error.message || "Failed to create team",
    });
  }
};

export const getAllTeams = async (
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

    const result = await getAllTeamsFromDB(
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
        error.message || "Failed to fetch teams",
    });
  }
};