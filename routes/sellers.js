import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn } from "../middleware.js";
import { index, seller, newForm, create } from "../controllers/sellers.js";

const router = Router();
router.route("/seller").get(seller);
router.route("/seller.php").get(isLoggedIn, catchAsync(index));

router
    .route("/seller/new")
    .get(isLoggedIn, newForm)
    .post(isLoggedIn, catchAsync(create));

export default router;
