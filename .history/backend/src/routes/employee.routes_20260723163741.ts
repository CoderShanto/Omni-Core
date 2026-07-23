import { Router } from "express";

import {
  createEmployee,
  getAllEmployees,
} from "../controllers/employee.controller";

const router = Router();

router.post("/", createEmployee);

router.get("/", getAllEmployees);

export default router;