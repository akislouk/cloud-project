import User from "../models/user.js";

export function index(req, res) {
    return res.render("users", { title: "Σύνδεση" });
}

export function home(req, res) {
    res.redirect("/index.php");
}

export async function login(req, res) {
    const { username, password } = req.body;
    const user = await User.findAndValidate(username, password);
    if (user) {
        req.session.user_id = user.id;
        res.redirect("/welcome.php");
    } else res.redirect("/index.php");
}

// const { scrypt, webcrypto } = await import("node:crypto");
// const salt = Buffer.from(webcrypto.getRandomValues(new Int8Array(16))).toString(
//     "base64url"
// );
// scrypt("password", salt, 64, (err, hash) => {
//     if (err) throw err;
//     console.log(salt, hash.toString("hex"));
// });
