import { Request, Response } from "express";
import {
  registerUserIntoDB,
  loginUserFromDB,
  getMeFromDB,
} from "../services/auth.service";

export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await registerUserIntoDB(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message:
        error.message || "Registration failed",
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const result = await loginUserFromDB(
      email,
      password
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message:
        error.message || "Login failed",
    });
  }
};

export const getMe = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getMeFromDB(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
};