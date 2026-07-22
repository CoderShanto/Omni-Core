import User from "../models/User";

export const createUserIntoDB = async (payload: {
  name: string;
  email: string;
}) => {
  const result = await User.create(payload);

  return result;
};

export const getAllUsersFromDB = async () => {
  const result = await User.find();

  return result;
};