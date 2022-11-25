import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn } from "../middleware.js";
import { index, products } from "../controllers/buyers.js";

const router = Router();
router.route("/products").get(products);
router.route("/products.php").get(isLoggedIn, catchAsync(index));

export default router;
