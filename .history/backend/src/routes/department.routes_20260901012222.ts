import { Router } from "express";
import {
  createDepartment,
  getAllDepartments,
} from "../controllers/department.controller";
import { auth } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Only CEO and Manager can create departments inside their company
router.post(
  "/",
  auth,
  authorizeRoles("ceo", "manager"),
  createDepartment
);

// Company members can view departments
router.get(
  "/",
  auth,
  authorizeRoles("ceo", "manager", "team_lead", "employee"),
  getAllDepartments
);

export default router;