import bcrypt from "bcryptjs";
import User from "../models/User";
import { IUser } from "../interfaces/user.interface";
import jwt from "jsonwebtoken";

export const registerUserIntoDB = async (
  payload: IUser
) => {
  const hashedPassword = await bcrypt.hash(
    payload.password,
    10
  );

  const result = await User.create({
    ...payload,
    password: hashedPassword,
  });

  return result;
};