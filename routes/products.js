import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn, isOwner } from "../middleware.js";
import * as products from "../controllers/products.js";

const router = Router();
router.route("/products").get(products.products);
router
    .route("/products.php")
    .get(isLoggedIn, catchAsync(products.index))
    .post(isLoggedIn, catchAsync(products.addToCart));

router.route("/cart").get(products.cart);
router
    .route("/cart.php")
    .get(isLoggedIn, catchAsync(products.show))
    .delete(isLoggedIn, catchAsync(isOwner), catchAsync(products.destroy));

export default router;
