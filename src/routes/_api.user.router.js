import { Router } from "express";
import {
  deleteUserById,
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
  updateUserById,
} from "../controller/_user.controller.js";

const userRouter = Router();

userRouter.post("/", registerUser);
userRouter.post("/", loginUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUserById);
userRouter.delete("/:id", deleteUserById);


export default userRouter