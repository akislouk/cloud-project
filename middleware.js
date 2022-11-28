import Cart from "./models/cart.js";
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
export const isAdmin = (req, res, next) => {
    if (req.user.role === "admin") next();
    else
        next(
            new ExpressError(
                "Δεν έχετε τα απαραίτητα δικαιώματα για να προβάλετε αυτήν τη σελίδα.",
                403
            )
        );
};

// Checks if the user is a seller
export const isSeller = (req, res, next) => {
    if (req.user.role !== "user") next();
    else
        next(
            new ExpressError(
                "Δεν έχετε τα απαραίτητα δικαιώματα για να προβάλετε αυτήν τη σελίδα.",
                403
            )
        );
};

// Checks if the user is the owner of the product or cart that they are trying to edit or delete
export const isOwner = async (req, res, next) => {
    try {
        if (req.params.pid) {
            // Finding the product using the id from the URL and saving it to the
            // request object so that it can be used by the next middleware.
            req.product = await Product.findById(req.params.pid);

            if (req.product.seller_name === req.user.username) next();
            else {
                if (!req.query.ref)
                    next(
                        new ExpressError(
                            "Δεν έχετε τα απαραίτητα δικαιώματα για να πραγματοποιήσετε αυτήν την ενέργεια.",
                            403
                        )
                    );
                else
                    res.status(403).send(`
                        <div class="toast align-items-center text-bg-danger fade show border-0 position-fixed bottom-0 end-0 z-index-1 me-3 mb-5"
                            role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="d-flex justify-content-between fs-6">
                                <div class="toast-body">
                                    Δεν έχετε τα απαραίτητα δικαιώματα για να πραγματοποιήσετε αυτήν την ενέργεια.
                                </div>
                                <div class="toast-body d-flex">
                                    <button class="btn-close btn-close-white mb-auto" data-bs-dismiss="toast" type="button"
                                        aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                        <script src="/scripts/toast.js" type="module"></script>`);
            }
        } else if (req.query.cid) {
            const cart = await Cart.findById(req.query.cid);

            if (cart !== "fail" && cart.user_id === req.user.id) next();
            else
                res.status(403).send(`
                <div class="toast align-items-center text-bg-danger fade show border-0 position-fixed bottom-0 end-0 z-index-1 me-3 mb-5"
                    role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex justify-content-between fs-6">
                        <div class="toast-body">
                            Δεν έχετε τα απαραίτητα δικαιώματα για να πραγματοποιήσετε αυτήν την ενέργεια.
                        </div>
                        <div class="toast-body d-flex">
                            <button class="btn-close btn-close-white mb-auto" data-bs-dismiss="toast" type="button"
                                aria-label="Close"></button>
                        </div>
                    </div>
                </div>
                <script src="/scripts/toast.js" type="module"></script>`);
        } else {
            next(new ExpressError("Not found", 404));
        }
    } catch (error) {
        next(error);
    }
};
