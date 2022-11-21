import User from "../models/user.js";

export const home = (req, res) => res.redirect("/index.php");
export const index = (req, res) => res.render("users", { title: "Σύνδεση" });

export const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findAndValidate(username, password);
    if (user) {
        req.session.user_id = user.id;
        res.redirect("/welcome.php");
    } else res.redirect("/index.php");
};

export const register = (req, res) => res.redirect("/signup.php");
export const signupForm = (req, res) =>
    res.render("users/signup", { title: "Εγγραφή" });

export const signup = async (req, res) => {
    res.redirect("/welcome.php");
};

// const { scrypt, webcrypto } = await import("node:crypto");
// const salt = Buffer.from(webcrypto.getRandomValues(new Int8Array(16))).toString(
//     "base64url"
// );
// scrypt("password", salt, 64, (err, hash) => {
//     if (err) throw err;
//     console.log(salt, hash.toString("hex"));
// });
