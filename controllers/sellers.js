import Product from "../models/product.js";

export const seller = (req, res) => res.redirect("/seller.php");
export const index = async (req, res) => {
    res.locals.products = await Product.findByUsername(req.user.username);
    res.locals.products.forEach((product) => {
        product.price = new Intl.NumberFormat("el-GR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(product.price);
    });
    res.render("sellers", { title: "Πύλη Πωλητών" });
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

        req.flash(
            "success",
            `Το προϊον ${product.name} καταχωρήθηκε με επιτυχία.`
        );
        res.redirect("/seller.php");
    } catch (error) {
        next(error);
    }
};
