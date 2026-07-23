import { Router } from "express";

import {
  createCompany,
  getAllCompanies,
} from "../controllers/company.controller";

const router = Router();

router.post("/", createCompany);

router.get("/", getAllCompanies);

export default router;