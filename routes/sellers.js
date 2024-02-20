import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn, isSeller, isOwner } from "../middleware.js";
import * as sellers from "../controllers/sellers.js";

const router = Router();

router.route("/seller").get(sellers.seller);
router.route("/seller.php").get(isLoggedIn, isSeller, catchAsync(sellers.index));

router
    .route("/seller/new")
    .get(isLoggedIn, isSeller, sellers.newForm)
    .post(isLoggedIn, isSeller, sellers.validateNewProduct, catchAsync(sellers.create));

router
    .route("/seller/:pid")
    .get(isLoggedIn, catchAsync(isOwner), catchAsync(sellers.edit))
    .put(
        isLoggedIn,
        catchAsync(isOwner),
        sellers.validateProduct,
        catchAsync(sellers.update)
    )
    .delete(isLoggedIn, catchAsync(isOwner), catchAsync(sellers.destroy));

export default router;
