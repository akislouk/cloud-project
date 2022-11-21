import pool from "./db.js";
import ExpressError from "../utils/ExpressError.js";
const { scrypt } = await import("node:crypto");

// user class
class User {
    constructor(user) {
        this.name = user.name;
        this.surname = user.surname;
        this.username = user.username;
        this.salt = user.salt;
        this.hash = user.hash;
        this.email = user.email;
        this.role = user.role;
        this.confirmed = user.confirmed;
    }

    // finds a user and checks if the given password matches the one in the db
    static async findAndValidate(username, password) {
        const user = await new Promise((resolve, reject) => {
            pool.query(
                `\
                SELECT id, name, surname, salt, HEX(hash) AS hash, email, role, confirmed
                FROM user WHERE username = '${username}'`,
                (error, results, fields) => {
                    if (error) throw new ExpressError(error);
                    resolve(results[0]);
                }
            );
        });

        const hash = await new Promise((resolve, reject) =>
            scrypt(password, user.salt, 64, (err, hash) => {
                if (err) throw err;
                resolve(hash.toString("hex").toUpperCase());
            })
        );

        return hash === user.hash ? user : false;
    }

    // finds a user using their id
    static async findById(id) {
        return new Promise((resolve, reject) => {
            pool.query(
                `\
                SELECT id, name, surname, email, role, confirmed
                FROM user WHERE id = ${id}`,
                (error, results, fields) => {
                    if (error) throw new ExpressError(error);
                    resolve(results[0]);
                }
            );
        });
    }
}

export default User;
