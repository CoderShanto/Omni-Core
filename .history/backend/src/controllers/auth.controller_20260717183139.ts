import { Request, Response } from "express";
import { registerUserIntoDB } from "../services/auth.service";
import { loginUserFromDB } from "../services/auth.service";

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