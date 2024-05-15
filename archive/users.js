import User from "../models/user.js";
import { newUserSchema, editUserSchema } from "../schemas.js";
import ExpressError from "../utils/ExpressError.js";
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
            req.flash("success", `Καλώς ορίσατε πίσω στο Cloud Project, ${user.name}!`);
            res.redirect(req.session.returnTo || "/welcome.php");
        } else {
            if (!user) req.flash("error", "Λάθος στοιχεία. Παρακαλώ δοκιμάστε ξανά.");
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
export const signup = (req, res) => res.render("users/signup", { title: "Εγγραφή" });

// Validates the request body
export const validateNewUser = (req, res, next) => {
    const { value, error } = newUserSchema.validate(req.body);
    req.body = value;
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else next();
};

// Creates the new user and saves them to the database
export const create = async (req, res, next) => {
    try {
        // Deconstructing the request body
        const { name, surname, username, email, role } = req.body;

        // Creating a salt by generating a random array of numbers
        // and turning it into a base-64, url-safe encoded string
        const salt = Buffer.from(webcrypto.getRandomValues(new Int8Array(16))).toString(
            "base64url"
        );

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

        req.flash(
            "success",
            `Καλώς ήρθατε στο Cloud Project, ${user.name}! Παρακαλώ περιμένετε να επιβεβαιώσει την εγγραφή σας ο διαχειριστής.`
        );
        res.redirect("/index.php");
    } catch (error) {
        next(error);
    }
};

export const welcome = (req, res) => res.render("users/welcome", { title: "Αρχική" });

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

export const admin = (req, res) => res.redirect("/administration.php");

// Finds all the users, saves them to the response object and displays the admin page
export const show = async (req, res, next) => {
    try {
        res.locals.users = await User.find();
        res.render("users/admin", { title: "Διαχείριση" });
    } catch (error) {
        next(error);
    }
};

// Finds the user, saves them to the response object and displays the edit form
export const edit = async (req, res, next) => {
    try {
        res.locals.usr = await User.findById(req.params.uid);
        if (res.locals.usr) res.render("users/edit", { title: "Επεξεργασία Χρήστη" });
        else throw new ExpressError("Not found.", 404);
    } catch (error) {
        next(error);
    }
};

// Validates the request body
export const validateUser = (req, res, next) => {
    const { value, error } = editUserSchema.validate(req.body);
    req.body = value;
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else next();
};

// Updates the user in the database
export const update = async (req, res, next) => {
    try {
        // Finding the user to be updated
        const user = await User.findById(req.params.uid).then((result) => {
            if (result) return new User(result);
            else next(new ExpressError("Not found.", 404));
        });

        // Deconstructing the request body
        const { name, surname, username, email, role, confirmed } = req.body;

        // Updating the user details if any new values are given
        name && (user.name = name);
        surname && (user.surname = surname);
        username && (user.username = username);
        email && (user.email = email);
        role && (user.role = role);
        confirmed && (user.confirmed = confirmed);

        // Updating the user in the database
        await user.update();

        // Sending success message and redirecting
        req.flash("success", "Οι αλλαγές σας αποθηκεύτηκαν με επιτυχία.");
        res.redirect("/administration.php");
    } catch (error) {
        next(error);
    }
};

// Deletes a user from the database
export const destroy = async (req, res, next) => {
    try {
        if (req.user.id === parseInt(req.params.uid))
            next(new ExpressError("Δεν μπορείς να διαγράψεις τον εαυτό σου!", 403));
        else {
            await User.remove(req.params.uid);

            // Sending success message and redirecting if the request came from the edit page
            if (!req.query.ref) {
                req.flash("success", "Ο χρήστης διαγράφηκε με επιτυχία.");
                res.redirect("/administration.php");
            } else {
                res.status(200).send(`\
                    <div class="toast align-items-center text-bg-success fade show border-0 position-fixed bottom-0 end-0 z-index-1 me-3 mb-5"
                        role="status" aria-live="polite" aria-atomic="true">
                        <div class="d-flex justify-content-between fs-6">
                            <div class="toast-body">
                                Ο χρήστης διαγράφηκε διαγράφηκε με επιτυχία.
                            </div>
                            <div class="toast-body d-flex">
                                <button class="btn-close btn-close-white mb-auto" data-bs-dismiss="toast" type="button"
                                    aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                    <script src="/scripts/toast.js" type="module"></script>`);
            }
        }
    } catch (error) {
        next(error);
    }
};
