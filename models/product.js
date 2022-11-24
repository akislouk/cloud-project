import pool from "./db.js";

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

    // Saves a new product to the database
    save = async () =>
        new Promise((resolve, reject) => {
            pool.query(
                `\
                INSERT INTO product (name, product_code, price, seller_name, category)
                SELECT
                    ${pool.escape(this.name)},
                    ${pool.escape(this.product_code)},
                    '${this.price}',
                    '${this.seller_name}',
                    ${pool.escape(this.category)};`,
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
                `SELECT * FROM product WHERE id = ${pool.escape(id)}`,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results[0]);
                }
            );
        });

    // Finds products using a seller's username
    static findByUsername = async (username) =>
        new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM product WHERE seller_name = '${username}'`,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });
}

export default Product;
