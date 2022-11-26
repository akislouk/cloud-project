import pool from "../models/db.js";

export const products = (req, res) => res.redirect("/products.php");

export const index = async (req, res, next) => {
    try {
        // Deconstructing the request query object
        const { product, seller, category, date } = req.query;

        // Validating the min/max values that were given
        let min = 0;
        let max = 999999.99;

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
        date && (query += ` AND date_of_withdrawal = ${pool.escape(date)};`);

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

        res.render("buyers", { title: "Κεντρική" });
    } catch (error) {
        next(error);
    }
};
