import { Router } from "express";

import {
  createCompany,
  getAllCompanies,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller";

import { auth } from "../middlewares/auth";
import { allowRoles } from "../middlewares/role.middleware";

const router = Router();

router.get(
  "/",
  auth,
  allowRoles("super_admin"),
  getAllCompanies
);

router.post(
  "/",
  auth,
  allowRoles("super_admin"),
  createCompany
);

router.put(
  "/:id",
  auth,
  allowRoles("super_admin"),
  updateCompany
);

router.delete(
  "/:id",
  auth,
  allowRoles("super_admin"),
  deleteCompany
);

export default router;