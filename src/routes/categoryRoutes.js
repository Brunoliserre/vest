import { Router } from "express";
import {
  getAllCategories,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryControllers";

const router = Router();

// .../category
router.get("/", getAllCategories);
router.get("/:id", getCategory);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);
router.put(":/id", updateCategory);

export default router;
