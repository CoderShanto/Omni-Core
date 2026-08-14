import { Router } from "express";

import {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

import { auth } from "../middlewares/auth";
import { allowRoles } from "../middlewares/role";

const router = Router();

router.get(
  "/",
  auth,
  allowRoles(
    "super_admin",
    "ceo",
    "manager",
    "team_lead"
  ),
  getAllUsers
);

router.post(
  "/",
  auth,
  allowRoles(
    "super_admin",
    "ceo",
    "manager",
    "team_lead"
  ),
  createUser
);

router.get(
  "/:id",
  auth,
  allowRoles(
    "super_admin",
    "ceo",
    "manager",
    "team_lead"
  ),
  getSingleUser
);

router.patch(
  "/:id",
  auth,
  allowRoles(
    "super_admin",
    "ceo",
    "manager",
    "team_lead"
  ),
  updateUser
);

router.delete(
  "/:id",
  auth,
  allowRoles(
    "super_admin",
    "ceo",
    "manager"
  ),
  deleteUser
);

export default router;