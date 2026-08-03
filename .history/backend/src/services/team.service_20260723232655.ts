import Team from "../models/Team";
import { ITeam } from "../interfaces/team.interface";

export const createTeamIntoDB = async (
  payload: ITeam
) => {
  const result = await Team.create(payload);

  return result;
};

export const getAllTeamsFromDB = async () => {
  const result = await Team.find()
    .populate("company", "name")
    .populate("department", "name")
    .populate("teamLead", "employeeId");

  return result;
};