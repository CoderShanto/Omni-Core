import { Request, Response } from "express";
import {
  createCompanyIntoDB,
  getAllCompaniesFromDB,
} from "../services/company.service";
import * as CompanyService from "../services/company.service";

// export const createCompany = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const result =
//       await createCompanyIntoDB(
//         req.body
//       );

//     res.status(201).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message:
//         "Failed to create company",
//     });
//   }
// };
export const createCompany = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await createCompanyIntoDB(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("CREATE COMPANY ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create company",
      error: error.message,
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
        id as string,
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

export const deleteCompany = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const result = await CompanyService.deleteCompanyFromDB(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete company",
    });
  }
};