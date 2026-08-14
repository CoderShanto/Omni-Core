import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { IUser } from "../interfaces/user.interface";

export const registerUserIntoDB = async (payload: IUser) => {
  const existingUser = await User.findOne({
    email: payload.email,
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Super admin does not need a company
  if (payload.role !== "super_admin" && !payload.companyId) {
    throw new Error("Company is required for this role");
  }

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

  const isPasswordMatched = await bcrypt.compare(
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
      companyId: user.companyId,
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

export const getMeFromDB = async (userId: string) => {
  return await User.findById(userId).populate(
    "companyId",
    "name email industry"
  );
};