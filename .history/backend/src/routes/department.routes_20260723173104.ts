import { Router } from "express";

import {
  createDepartment,
  getAllDepartments,
} from "../controllers/department.controller";

const router = Router();

router.post("/", createDepartment);

router.get("/", getAllDepartments);

export default router;