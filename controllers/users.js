import User from "../models/user.js";
const { scrypt, webcrypto } = await import("node:crypto");

export const home = (req, res) => res.redirect("/index.php");
export const index = (req, res) => {
    if (req.session.user) res.redirect("/welcome.php");
    else res.render("users", { title: "Σύνδεση" });
};

// Logs the user in if they gave the right credentials and if they are confirmed
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findAndValidate(username, password);

        if (user && user.confirmed === 1) {
            req.session.user = user.id;
            req.flash(
                "success",
                `Καλώς ορίσατε πίσω στο Cloud Project, ${user.name}!`
            );
            res.redirect(req.session.returnTo || "/welcome.php");
        } else {
            if (!user)
                req.flash("error", "Λάθος στοιχεία. Παρακαλώ δοκιμάστε ξανά.");
            else
                req.flash(
                    "error",
                    "Δεν έχει γίνει ακόμα επιβεβαίωση του λογαριασμού σας. Παρακαλώ επικοινωνήστε με το διαχειριστή."
                );
            res.redirect("/index.php");
        }
    } catch (error) {
        next(error);
    }
};

export const register = (req, res) => res.redirect("/signup.php");
export const signup = (req, res) =>
    res.render("users/signup", { title: "Εγγραφή" });

// Creates the new user and saves them to the database
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

        // Using the User class constructor to create the new user
        const user = new User({
            name,
            surname,
            username,
            salt,
            hash,
            email,
            role,
        });

        // Saving the new user to the database
        await user.save();

        req.flash("success", `Καλώς ήρθατε στο Cloud Project, ${user.name}!`);
        res.redirect("/welcome.php");
    } catch (error) {
        next(error);
    }
};

export const welcome = (req, res) =>
    res.render("users/welcome", { title: "Αρχική" });

// Logs the user out by removing their ID from the session cookie
export const logout = (req, res, next) => {
    req.session.user = null;
    req.session.save(function (error) {
        if (error) next(error);
        req.session.regenerate(function (error) {
            if (error) next(error);
            req.flash("success", "Έχετε αποσυνδεθεί. Αντίο!");
            res.redirect("/index.php");
        });
    });
};
