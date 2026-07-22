import User from "../models/User";
import { IUser } from "../interfaces/user.interface";

export const createUserIntoDB = async (payload: IUser) => {
  const result = await User.create(payload);

  return result;
};

export const getAllUsersFromDB = async () => {
  const result = await User.find();

  return result;

  export const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);

  return result;
};
};