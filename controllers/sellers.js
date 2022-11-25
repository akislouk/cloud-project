import Product from "../models/product.js";

export const seller = (req, res) => res.redirect("/seller.php");
export const index = async (req, res, error) => {
    try {
        // Finding the seller's products
        res.locals.products = await Product.findByUsername(req.user.username);

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

// Creates the new product and saves it to the database
export const create = async (req, res, next) => {
    try {
        // Deconstructing the request body
        const { name, product_code, category } = req.body;

        // Changing the format to match the format in the database
        const price = new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 2,
            useGrouping: false,
        }).format(req.body.price.replace(",", "."));

        // Using the Product class constructor to create the new product
        const product = new Product({
            name,
            product_code,
            price,
            seller_name: req.user.username,
            category,
        });

        // Saving the new product to the database
        await product.save();

        // Sending success message and redirecting
        req.flash(
            "success",
            `Το προϊον ${product.name} καταχωρήθηκε με επιτυχία.`
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

// Updates the product in the database
export const update = async (req, res, next) => {
    try {
        // Deconstructing the request body
        const { name, product_code, category } = req.body;
        let price = req.body.price;

        // Changing the format to match the format in the database
        price &&
            (price = new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 2,
                useGrouping: false,
            }).format(req.body.price.replace(",", ".")));

        // Updating the product details if any new values are given
        name && (req.product.name = name);
        product_code && (req.product.product_code = product_code);
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

export const destroy = async (req, res, next) => {
    try {
        await Product.remove(req.params.pid);

        // Sending success message and redirecting
        req.flash(
            "success",
            `Το προϊόν "${req.product.name}" διαγράφηκε με επιτυχία.`
        );
        res.redirect("/seller.php");
    } catch (error) {
        next(error);
    }
};
