import Position from "../models/Position";
import Department from "../models/Department";

import { IPosition } from "../interfaces/position.interface";

export const createPositionIntoDB = async (
  payload: Omit<
    IPosition,
    "companyId"
  >,
  companyId: string
) => {
  // Make sure the department belongs
  // to the authenticated company
  const department = await Department.findOne({
    _id: payload.departmentId,
    companyId,
  });

  if (!department) {
    throw new Error(
      "Department does not belong to your company"
    );
  }

  const result = await Position.create({
    ...payload,
    companyId,
  });

  return result;
};

export const getAllPositionsFromDB =
  async (companyId: string) => {
    const result = await Position.find({
      companyId,
    })
      .populate(
        "companyId",
        "name industry"
      )
      .populate(
        "departmentId",
        "name description"
      );

    return result;
  };