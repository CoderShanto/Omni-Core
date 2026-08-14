import {
  NextFunction,
  Request,
  Response,
} from "express";

export const tenant = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Super Admin works at platform level
  if (req.user.role === "super_admin") {
    return next();
  }

  // All company users must have a company
  if (!req.user.companyId) {
    return res.status(403).json({
      success: false,
      message: "Company association required",
    });
  }

  next();
};