import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryControllers.js";

const router = Router();

// .../category
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);
router.put(":/id", updateCategory);

export default router;
