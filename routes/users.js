import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn, isAdmin } from "../middleware.js";
import * as users from "../controllers/users.js";

const router = Router();
router.route("/").get(users.home);
router.route("/login").get(users.home);
router.route("/index").get(users.home);
router.route("/index.php").get(users.index).post(catchAsync(users.login));

router.route("/register").get(users.register);
router.route("/signup").get(users.register);
router
    .route("/signup.php")
    .get(users.signup)
    .post(users.validateNewUser, catchAsync(users.create));

router.route("/welcome.php").get(isLoggedIn, users.welcome);
router.route("/logout").get(isLoggedIn, users.logout);

router.route("/admin").get(users.admin);
router.route("/administration").get(users.admin);
router.route("/administration.php").get(isLoggedIn, isAdmin, catchAsync(users.show));
router
    .route("/administration/:uid")
    .get(isLoggedIn, isAdmin, catchAsync(users.edit))
    .put(isLoggedIn, isAdmin, users.validateUser, catchAsync(users.update))
    .delete(isLoggedIn, isAdmin, catchAsync(users.destroy));

export default router;
