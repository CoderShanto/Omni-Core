import { Request, Response } from "express";
import { registerUserIntoDB } from "../services/auth.service";
import { loginUserFromDB } from "../services/auth.service";
import { getMeFromDB } from "../services/auth.service";
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
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration Failed",
    });
  }
};
export const loginUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } =
      req.body;

    const result =
      await loginUserFromDB(
        email,
        password
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login Failed",
    });
  }
};