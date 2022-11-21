import { Router } from "express";
import { index, home, login } from "../controllers/users.js";
import catchAsync from "../utils/catchAsync.js";
// import { isLoggedIn, isOnline } from "../middleware.js";

const router = Router();

router.route("/index.php").get(index).post(catchAsync(login));
router.route("/").get(home);
router.route("/index").get(home);
router.route("/login").get(home);

// router.route("/register").get(register).post(catchAsync(verify));

// router
//     .route("/register/complete")
//     .get(registerForm)
//     .post(
//         catchAsync(isOnline),
//         validateUser,
//         catchAsync(createInDb),
//         catchAsync(getCookie),
//         catchAsync(createBusiness),
//         catchAsync(createUser),
//         catchAsync(giveRights),
//         complete
//     );

// router.get("/logout", catchAsync(logout));

export default router;
