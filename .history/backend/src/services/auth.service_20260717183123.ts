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

export const loginUserFromDB = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatched =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordMatched) {
    throw new Error("Wrong Password");
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user,
  };
};