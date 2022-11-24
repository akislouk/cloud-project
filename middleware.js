import Product from "./models/product.js";
import ExpressError from "./utils/ExpressError.js";

// Checks if the user is logged in
export const isLoggedIn = (req, res, next) => {
    if (req.session.user) next();
    else {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Πρέπει να συνδεθείτε πρώτα!");
        res.redirect("/index.php");
    }
};

// Checks if the user is a seller
export const isSeller = (req, res, next) => {
    if (!(req.user.role === "user")) next();
    else
        next(
            new ExpressError(
                "Δεν έχετε τα απαραίτητα δικαιώματα για να προβάλετε αυτήν τη σελίδα.",
                403
            )
        );
};

// Checks if the user is the owner of the product they are trying to edit/delete
export const isOwner = async (req, res, next) => {
    // Finding the product using the id from the URL and saving it to the
    // request object so that it can be used by the next middleware.
    req.product = await Product.findById(req.params.pid);

    if (req.product.seller_name === req.user.username) next();
    else
        next(
            new ExpressError(
                "Δεν έχετε τα απαραίτητα δικαιώματα για να πραγματοποιήσετε αυτήν την ενέργεια.",
                403
            )
        );
};
