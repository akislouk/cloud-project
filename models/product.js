import pool from "./db.js";
import ExpressError from "../utils/ExpressError.js";

// Product class
class Product {
    constructor(product) {
        this.id = product.id || null;
        this.name = product.name;
        this.product_code = product.product_code;
        this.price = product.price;
        this.date_of_withdrawal = product.date_of_withdrawal || null;
        this.seller_name = product.seller_name;
        this.category = product.category;
    }

    // Saves a product to the database
    save = async () =>
        new Promise((resolve, reject) => {
            pool.query(
                `\
                INSERT INTO product SET ? AS new
                    ON DUPLICATE KEY UPDATE
                        name = new.name,
                        product_code = new.product_code,
                        price = new.price,
                        category = new.category;`,
                this,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results[0]);
                }
            );
        });

    // Finds a product using its id
    static findById = async (id) =>
        new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM product WHERE id = ${pool.escape(id)};`,
                (error, results, fields) => {
                    if (error) return reject(error);
                    if (!results[0]) return resolve("fail");
                    resolve(new Product(results[0]));
                }
            );
        });

    // Finds products using a seller's username
    static findByUsername = async (username) =>
        new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM product WHERE seller_name = '${username}';`,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });

    // Deletes a product using its id
    static remove = async (id) =>
        new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM product WHERE id = ${id};`,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });
}

export default Product;
