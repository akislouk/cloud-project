import User from "../models/user.js";
const { scrypt, webcrypto } = await import("node:crypto");

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
export const signup = (req, res) =>
    res.render("users/signup", { title: "Εγγραφή" });

// Creates the new user and saves him to the database
export const create = async (req, res, next) => {
    try {
        // Deconstructing the request body
        const { name, surname, username, email, role } = req.body;

        // Creating a salt by generating a truly random array of numbers
        // and turning it into a base-64, url-safe encoded string
        const salt = Buffer.from(
            webcrypto.getRandomValues(new Int8Array(16))
        ).toString("base64url");

        // Generating a hash using the user's password and the salt.
        // The hash is a 128-long hexadecimal
        const hash = await new Promise((resolve, reject) =>
            scrypt(req.body.password, salt, 64, (error, hash) => {
                if (error) return reject(error);
                resolve(hash.toString("hex").toUpperCase());
            })
        );

        // using the User class constructor to create the new user
        const user = new User({
            name,
            surname,
            username,
            salt,
            hash,
            email,
            role,
        });

        // saving the new user to the database
        await user.save();

        req.flash(
            "success",
            `Καλώς ήρθατε στο Cloud Project, ${user.username}!`
        );
        res.redirect("/welcome.php");
    } catch (error) {
        next(error);
    }
};
