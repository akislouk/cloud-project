import pool from "./db.js";
const { scrypt } = await import("node:crypto");

// user class
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
            console.log(this);
            pool.query(
                `\
                INSERT INTO user (name, surname, username, salt, hash, email, role)
                SELECT
                    ${pool.escape(this.name)},
                    ${pool.escape(this.surname)},
                    ${pool.escape(this.username)},
                    '${this.salt}',
                    UNHEX('${this.hash}'),
                    ${pool.escape(this.email)},
                    ${pool.escape(this.role)};`,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results[0]);
                }
            );
        });

    // Finds a user using their id
    static findById = async (id) =>
        new Promise((resolve, reject) => {
            pool.query(
                `\
                SELECT id, name, surname, email, role, confirmed
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

        const hash = await new Promise((resolve, reject) =>
            scrypt(password, user.salt, 64, (error, hash) => {
                if (error) return reject(error);
                resolve(hash.toString("hex").toUpperCase());
            })
        );

        return hash === user.hash ? user : false;
    }
}

export default User;
