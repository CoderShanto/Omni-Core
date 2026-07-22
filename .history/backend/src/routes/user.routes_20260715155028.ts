// import { Router } from "express";
// import User from "../models/User";

// const router = Router();

// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find();

//     res.status(200).json({
//       success: true,
//       data: users,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch users",
//     });
//   }
// });

// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     res.status(200).json({
//       success: true,
//       data: user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch user",
//     });
//   }
// });

// router.post("/", async (req, res) => {
//   try {
//     const user = await User.create(req.body);

//     res.status(201).json({
//       success: true,
//       data: user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create user",
//     });
//   }
// });

// router.patch("/:id", async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//       }
//     );

//     res.status(200).json({
//       success: true,
//       data: updatedUser,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update user",
//     });
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);

//     res.status(200).json({
//       success: true,
//       data: deletedUser,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete user",
//     });
//   }
// });

// export default router;


import { Router } from "express";

import {
  createUser,
  getAllUsers,
  getSingleUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getAllUsers);

router.post("/", createUser);
router.get("/:id", getSingleUser);

export default router;