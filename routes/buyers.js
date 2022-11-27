import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn, isOwner } from "../middleware.js";
import {
    index,
    products,
    addToCart,
    cart,
    show,
    destroy,
} from "../controllers/buyers.js";

const router = Router();
router.route("/products").get(products);
router
    .route("/products.php")
    .get(isLoggedIn, catchAsync(index))
    .post(isLoggedIn, catchAsync(addToCart));

router.route("/cart").get(cart);
router
    .route("/cart.php")
    .get(isLoggedIn, catchAsync(show))
    .delete(isLoggedIn, catchAsync(isOwner), catchAsync(destroy));

export default router;
