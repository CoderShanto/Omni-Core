import { Router } from "express";

import {
  createEmployee,
  getAllEmployees,
} from "../controllers/employee.controller";

import { auth } from "../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth,
  createEmployee
);

router.get(
  "/",
  auth,
  getAllEmployees
);

export default router;