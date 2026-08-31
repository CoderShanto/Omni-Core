import {
  NextFunction,
  Request,
  Response,
} from "express";

type Role =
  | "super_admin"
  | "ceo"
  | "manager"
  | "team_lead"
  | "employee"
  | "client";

export const authorizeRoles = (
  ...allowedRoles: Role[]
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // User must be authenticated first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // User is authenticated but doesn't have
    // the required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};