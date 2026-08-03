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
    const result = await createTeamIntoDB(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to create team",
    });
  }
};

export const getAllTeams = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getAllTeamsFromDB();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch teams",
    });
  }
};