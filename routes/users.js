import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn } from "../middleware.js";
import {
    home,
    index,
    login,
    register,
    signup,
    create,
    logout,
    welcome,
} from "../controllers/users.js";

const router = Router();
router.route("/").get(home);
router.route("/login").get(home);
router.route("/index").get(home);
router.route("/index.php").get(index).post(catchAsync(login));
router.route("/register").get(register);
router.route("/signup").get(register);
router.route("/signup.php").get(signup).post(catchAsync(create));
router.route("/welcome.php").get(isLoggedIn, welcome);
router.route("/logout").get(logout);

export default router;
