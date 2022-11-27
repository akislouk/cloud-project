import pool from "../models/db.js";
import Cart from "../models/cart.js";

export const products = (req, res) => res.redirect("/products.php");

// Finds products based on the URL search params and sends them to the frontend
export const index = async (req, res, next) => {
    try {
        // Deconstructing the request query object
        const { product, seller, category, date } = req.query;
        let min = 0;
        let max = 999999.99;

        // Validating the min/max values
        if (req.query.min) {
            if (req.query.max)
                if (parseFloat(req.query.min) < parseFloat(req.query.max)) {
                    min = req.query.min;
                    max = req.query.max;
                } else {
                    min = req.query.max;
                    max = req.query.min;
                }
            else min = req.query.min;
        } else req.query.max && (max = req.query.max);

        // Defining the base query
        let query = `\
            SELECT
                p.id AS id,
                p.name AS name,
                price,
                date_of_withdrawal,
                category,
                seller_name,
                u.name AS first_name
            FROM product AS p
            JOIN user AS u ON seller_name = username
            WHERE price BETWEEN ${min} AND ${max}`;

        // Adding conditions to the query's where clause
        product &&
            (query += ` AND p.name LIKE ${pool.escape("%" + product + "%")}`);
        seller &&
            (query += ` AND (seller_name = ${pool.escape(
                seller
            )} OR u.name = ${pool.escape(seller)})`);
        category && (query += ` AND category = ${pool.escape(category)}`);
        date &&
            (query += ` AND date_of_withdrawal LIKE ${pool.escape(
                "%" + date + "%"
            )};`);

        // Finding the products
        res.locals.products = await new Promise((resolve, reject) => {
            pool.query(query, (error, results, fields) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        // Turning the prices to the Greek price format
        res.locals.products.forEach((product) => {
            product.price = new Intl.NumberFormat("el-GR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(product.price);
        });

        // Finding the min and max prices in the database to initialize the inputs
        res.locals.price = await new Promise((resolve, reject) => {
            pool.query(
                "SELECT MIN(price) AS min, MAX(price) as max FROM product",
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results[0]);
                }
            );
        });

        res.render("products", { title: "Κεντρική" });
    } catch (error) {
        next(error);
    }
};

// Add a product to the user's cart
export const addToCart = async (req, res, next) => {
    try {
        // Creating a cart using the Cart class constructor
        const cart = new Cart({
            user_id: req.user.id,
            product_id: req.query.pid,
            date_of_insertion: new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
        });

        // Saving the cart to the database
        await cart.save();

        // Sending success message and redirecting
        req.flash("cart", "success");
        res.redirect("/products.php");
    } catch (error) {
        next(error);
    }
};

export const cart = (req, res) => res.redirect("/cart.php");

// Finds the products in the user's cart and sends them to the frontend
export const show = async (req, res, next) => {
    try {
        res.locals.products = await new Promise((resolve, reject) => {
            pool.query(
                `\
                SELECT c.id AS id, user_id, product_id, name, price, date_of_insertion
                FROM cart AS c
                INNER JOIN product AS p ON product_id = p.id
                WHERE user_id = ${req.user.id};`,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });

        res.render("products/cart", { title: "Καλάθι Αγορών" });
    } catch (error) {
        next(error);
    }
};

// Deletes a product from the user's cart
export const destroy = async (req, res, next) => {
    try {
        await Cart.remove(req.query.cid);

        // Sending success message
        res.status(200).send(`
            <div class="alert alert-success alert-dismissible fade show border-0 position-fixed bottom-0 end-0 z-index-1 me-3 mb-5"
                role="alert" aria-live="polite" aria-atomic="true">
                Το προϊόν αφαιρέθηκε από το καλάθι σας.
                <button class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`);
    } catch (error) {
        next(error);
    }
};
