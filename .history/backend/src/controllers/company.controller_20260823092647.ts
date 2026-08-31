import { Request, Response } from "express";

import * as CompanyService from "../services/company.service";

export const createCompany = async (
  req: Request,
  res: Response
) => {
  try {
    const result =
      await CompanyService.createCompanyIntoDB(
        req.body
      );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("CREATE COMPANY ERROR:", error);

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
      await CompanyService.getAllCompaniesFromDB();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch companies",
    });
  }
};

export const updateCompany = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const result =
      await CompanyService.updateCompanyIntoDB(
        id,
        req.body
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

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
    const id = req.params.id as string;

    const result =
      await CompanyService.deleteCompanyFromDB(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete company",
    });
  }
};