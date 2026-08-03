import { Request, Response } from "express";
import {
  createCompanyIntoDB,
  getAllCompaniesFromDB,
} from "../services/company.service";

export const createCompany = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await createCompanyIntoDB(
        req.body
      );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to create company",
    });
  }
};

export const getAllCompanies = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await getAllCompaniesFromDB();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch companies",
    });
  }
};

// export const updateCompany = async (
//   req: Request,
//   res: Response
// ) => {

// };

export const updateCompany = async (
  req: Request,
  res: Response
) => {
  try {

    const id = req.params.id;

    const result =
      await CompanyService.updateCompanyIntoDB(
        id,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: result,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to update company",
    });

  }
};