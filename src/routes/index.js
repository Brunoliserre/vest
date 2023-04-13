import { Router } from "express";
//import User from "./userRoutes.js";
import Category from "./categoryRoutes.js";
import Product from "./productRoutes.js";
//import Order from "./orderRoutes.js";

const router = Router();

//router.use("/user", User);
router.use("/category", Category);
router.use("/product", Product);
//router.use("/order", Order);

export default router;
