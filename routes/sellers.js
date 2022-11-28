import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn, isSeller, isOwner } from "../middleware.js";
import {
    index,
    seller,
    newForm,
    create,
    edit,
    update,
    destroy,
    validateNewProduct,
    validateProduct,
} from "../controllers/sellers.js";

const router = Router();

router.route("/seller").get(seller);
router.route("/seller.php").get(isLoggedIn, isSeller, catchAsync(index));

router
    .route("/seller/new")
    .get(isLoggedIn, isSeller, newForm)
    .post(isLoggedIn, isSeller, validateNewProduct, catchAsync(create));

router
    .route("/seller/:pid")
    .get(isLoggedIn, catchAsync(isOwner), catchAsync(edit))
    .put(isLoggedIn, catchAsync(isOwner), validateProduct, catchAsync(update))
    .delete(isLoggedIn, catchAsync(isOwner), catchAsync(destroy));

export default router;
