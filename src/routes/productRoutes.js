import { Router } from "express";
import {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productControllers";

const router = Router();

// .../product
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);
router.put(":/id", updateProduct);

export default router;
