import Team from "../models/Team";
import Department from "../models/Department";
import Employee from "../models/Employee";

import { ITeam } from "../interfaces/team.interface";

export const createTeamIntoDB = async (
  payload: Omit<ITeam, "company">,
  companyId: string
) => {
  // Check department belongs to authenticated company
  const department = await Department.findOne({
    _id: payload.department,
    companyId,
  });

  if (!department) {
    throw new Error(
      "Department does not belong to your company"
    );
  }

  // Check team lead belongs to authenticated company
  const teamLead = await Employee.findOne({
    _id: payload.teamLead,
    companyId,
  });

  if (!teamLead) {
    throw new Error(
      "Team lead does not belong to your company"
    );
  }

  const result = await Team.create({
    ...payload,
    company: companyId,
  });

  return result;
};

export const getAllTeamsFromDB = async (
  companyId: string
) => {
  const result = await Team.find({
    company: companyId,
  })
    .populate("company", "name")
    .populate("department", "name")
    .populate("teamLead", "employeeId");

  return result;
};