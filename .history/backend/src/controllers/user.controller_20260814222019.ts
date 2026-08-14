import { Request, Response } from "express";
import {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
} from "../services/user.service";

export const createUser = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await createUserIntoDB(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const companyId =
      req.user.role === "super_admin"
        ? undefined
        : req.user.companyId;

    const result =
      await getAllUsersFromDB(companyId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const getSingleUser = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getSingleUserFromDB(
      req.params.id as string
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};
export const updateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await updateUserIntoDB(
      req.params.id as string,
      req.body
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await deleteUserFromDB(
      req.params.id as string
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};