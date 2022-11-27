import ExpressError from "../utils/ExpressError.js";
import pool from "./db.js";

// Cart class
class Cart {
    constructor(cart) {
        this.id = cart.id || null;
        this.user_id = cart.user_id;
        this.product_id = cart.product_id;
        this.date_of_insertion = cart.date_of_insertion || null;
    }

    // Saves a cart to the database
    save = async () =>
        new Promise((resolve, reject) => {
            pool.query(
                `\
                INSERT INTO cart SET ? AS new
                    ON DUPLICATE KEY UPDATE
                        user_id = new.user_id,
                        product_id = new.product_id,
                        date_of_insertion = new.date_of_insertion;`,
                this,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results[0]);
                }
            );
        });

    // Finds a card using its id
    static findById = async (id) =>
        new Promise((resolve, reject) => {
            pool.query(
                "SELECT * FROM cart WHERE id = ?",
                id,
                (error, results, fields) => {
                    if (error) return reject(error);
                    if (!results[0])
                        return reject(
                            new ExpressError(
                                "Δεν έχετε τα απαραίτητα δικαιώματα για να πραγματοποιήσετε αυτήν την ενέργεια.",
                                403
                            )
                        );
                    resolve(new Cart(results[0]));
                }
            );
        });

    // Deletes a cart using its id
    static remove = async (id) =>
        new Promise((resolve, reject) => {
            pool.query(
                "DELETE FROM cart WHERE id = ?;",
                id,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });
}

export default Cart;
