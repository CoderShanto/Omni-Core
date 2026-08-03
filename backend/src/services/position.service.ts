import Position from "../models/Position";
import { IPosition } from "../interfaces/position.interface";

export const createPositionIntoDB = async (
  payload: IPosition
) => {
  const result = await Position.create(payload);

  return result;
};

export const getAllPositionsFromDB =
  async () => {
    const result = await Position.find()
      .populate("company", "name")
      .populate("department", "name");

    return result;
  };