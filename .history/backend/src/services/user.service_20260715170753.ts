import User from "../models/User";
import { IUser } from "../interfaces/user.interface";

export const createUserIntoDB = async (payload: IUser) => {
  const result = await User.create(payload);
  return result;
};

export const getAllUsersFromDB = async () => {
  const result = await User.find();
  return result;
};

export const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

export const updateUserIntoDB = async (
  id: string,
  payload: Partial<{
    name: string;
    email: string;
  }>
) => {
  const result = await User.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
    }
  );

  return result;
};

export const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndDelete(id);

  return result;
};