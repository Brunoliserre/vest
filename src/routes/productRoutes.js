import { Router } from "express";
import {
  getAllProducts,
  //getProductByName,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productControllers.js";

const router = Router();

// .../product
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);
router.put(":/id", updateProduct);

export default router;
