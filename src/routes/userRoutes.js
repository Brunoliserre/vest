import { Router } from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/userControllers";

const router = Router();

// .../user
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.put(":/id", updateUser);

export default router;
