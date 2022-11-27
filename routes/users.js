import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import { isLoggedIn, isAdmin } from "../middleware.js";
import {
    home,
    index,
    login,
    register,
    signup,
    create,
    welcome,
    logout,
    admin,
    show,
    edit,
    update,
    destroy,
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
router.route("/logout").get(isLoggedIn, logout);

router.route("/admin").get(admin);
router.route("/administration").get(admin);
router.route("/administration.php").get(isLoggedIn, isAdmin, catchAsync(show));
router
    .route("/administration/:uid")
    .get(isLoggedIn, isAdmin, catchAsync(edit))
    .put(isLoggedIn, isAdmin, catchAsync(update))
    .delete(isLoggedIn, isAdmin, catchAsync(destroy));

export default router;
