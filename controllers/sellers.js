import Product from "../models/product.js";
import { newProductSchema, editProductSchema } from "../schemas.js";
import ExpressError from "../utils/ExpressError.js";

export const seller = (req, res) => res.redirect("/seller.php");
export const index = async (req, res, error) => {
    try {
        // Finding the seller's products
        res.locals.products = await Product.findByUsername(
            req.user.username
        ).lean();

        // Turning the prices to the Greek price format
        res.locals.products.forEach((product) => {
            product.price = new Intl.NumberFormat("el-GR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(product.price);
        });
        res.render("sellers", { title: "Πύλη Πωλητών" });
    } catch (error) {
        next(error);
    }
};

export const newForm = (req, res) =>
    res.render("sellers/new", { title: "Νέο Προϊόν" });

// Validates the request body
export const validateNewProduct = (req, res, next) => {
    req.body.price = req.body.price.replace(",", ".");
    const { value, error } = newProductSchema.validate(req.body);
    req.body = value;
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else next();
};

// Creates the new product and saves it to the database
export const create = async (req, res, next) => {
    try {
        // Deconstructing the request body
        const { name, code, price, category } = req.body;

        // Using the Product class constructor to create the new product
        const product = new Product({
            name,
            code,
            price,
            seller: req.user.username,
            category,
        });

        // Saving the new product to the database
        await product.save();

        // Sending success message and redirecting
        req.flash(
            "success",
            `Το προϊον "${product.name}" καταχωρήθηκε με επιτυχία.`
        );
        res.redirect("/seller.php");
    } catch (error) {
        next(error);
    }
};

// Sends the requested product to the frontend and renders the edit page
export const edit = async (req, res, next) => {
    try {
        res.locals.product = req.product;
        res.render("sellers/edit", { title: "Επεξεργασία Προϊόντος" });
    } catch (error) {
        next(error);
    }
};

// Validates the request body
export const validateProduct = (req, res, next) => {
    req.body.price = req.body.price.replace(",", ".");
    const { value, error } = editProductSchema.validate(req.body);
    req.body = value;
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else next();
};

// Updates the product in the database
export const update = async (req, res, next) => {
    try {
        // Deconstructing the request body
        const { name, code, price, category } = req.body;

        // Updating the product details if any new values are given
        name && (req.product.name = name);
        code && (req.product.code = code);
        price && (req.product.price = price);
        category && (req.product.category = category);

        // Saving the changes to the database
        await req.product.save();

        // Sending success message and redirecting
        req.flash("success", "Οι αλλαγές σας αποθηκεύτηκαν με επιτυχία.");
        res.redirect("/seller.php");
    } catch (error) {
        next(error);
    }
};

// Deletes a product from the database
export const destroy = async (req, res, next) => {
    try {
        const product = await req.product.remove();

        // Sending success message and redirecting if the request came from the edit page
        if (!req.query.ref) {
            req.flash(
                "success",
                `Το προϊόν "${req.product.name}" διαγράφηκε με επιτυχία.`
            );
            res.redirect("/seller.php");
        } else {
            if (product.$isDeleted())
                res.status(200).send(`
                <div class="toast align-items-center text-bg-success fade show border-0 position-fixed bottom-0 end-0 z-index-1 me-3 mb-5"
                    role="status" aria-live="polite" aria-atomic="true">
                    <div class="d-flex justify-content-between fs-6">
                        <div class="toast-body">
                            Το προϊόν "${req.product.name}" διαγράφηκε με επιτυχία.
                        </div>
                        <div class="toast-body d-flex">
                            <button class="btn-close btn-close-white mb-auto" data-bs-dismiss="toast" type="button"
                                aria-label="Close"></button>
                        </div>
                    </div>
                </div>
                <script src="/scripts/toast.js" type="module"></script>`);
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
    } catch (error) {
        next(error);
    }
};
