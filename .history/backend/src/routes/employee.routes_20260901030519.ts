import { Router } from "express";
import {
  createEmployee,
  getAllEmployees,
} from "../controllers/employee.controller";
import { auth } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Only CEO and Manager can onboard/create employees
router.post(
  "/",
  auth,
  authorizeRoles("ceo", "manager"),
  createEmployee
);

// Internal team members can view employee directories
router.get(
  "/",
  auth,
  authorizeRoles("ceo", "manager", "team_lead", "employee"),
  getAllEmployees
);

export default router;