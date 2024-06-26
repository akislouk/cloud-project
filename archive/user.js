import pool from "./db.js";
const { scrypt } = await import("node:crypto");

// The user class
class User {
    constructor(user) {
        this.id = user.id || null;
        this.name = user.name;
        this.surname = user.surname;
        this.username = user.username;
        this.salt = user.salt;
        this.hash = user.hash;
        this.email = user.email;
        this.role = user.role;
        this.confirmed = user.confirmed || 0;
    }

    // Saves a new user to the database
    save = async () =>
        new Promise((resolve, reject) => {
            pool.query(
                `\
                INSERT INTO user (name, surname, username, salt, hash, email, role)
                SELECT
                    '${this.name}',
                    '${this.surname}',
                    ${pool.escape(this.username)},
                    '${this.salt}',
                    UNHEX('${this.hash}'),
                    ${pool.escape(this.email)},
                    '${this.role}';`,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });

    // Updates a user in the database
    update = async () =>
        new Promise((resolve, reject) => {
            pool.query(
                `UPDATE user
                SET
                    name = '${this.name}',
                    surname = '${this.surname}',
                    username = ${pool.escape(this.username)},
                    email = ${pool.escape(this.email)},
                    role = '${this.role}',
                    confirmed = ${this.confirmed}
                WHERE ID = ?;`,
                this.id,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results[0]);
                }
            );
        });

    // Finds all the users
    static find = async () =>
        new Promise((resolve, reject) => {
            pool.query(
                "SELECT id, name, surname, username, email, role, confirmed FROM user",
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });

    // Finds a user using their id
    static findById = async (id) =>
        new Promise((resolve, reject) => {
            pool.query(
                `\
                SELECT id, name, surname, username, email, role, confirmed
                FROM user WHERE id = ${pool.escape(id)}`,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results[0]);
                }
            );
        });

    // Finds a user and checks if the given password matches the one in the db
    static async findAndValidate(username, password) {
        const user = await new Promise((resolve, reject) => {
            pool.query(
                `\
                SELECT id, name, surname, salt, HEX(hash) AS hash, email, role, confirmed
                FROM user WHERE username = '${username}'`,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results[0]);
                }
            );
        });

        if (user) {
            // Encrypting the given password using the user's salt from the database
            const hash = await new Promise((resolve, reject) =>
                scrypt(password, user.salt, 64, (error, hash) => {
                    if (error) return reject(error);
                    resolve(hash.toString("hex").toUpperCase());
                })
            );

            // Comparing the new encrypted password with the one in the database
            return hash === user.hash ? user : false;
        } else return false;
    }

    // Deletes a user using their id
    static remove = async (id) =>
        new Promise((resolve, reject) => {
            pool.query(
                "DELETE FROM user WHERE id = ?;",
                id,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });
}

export default User;
