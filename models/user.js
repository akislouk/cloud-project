import pool from "./db.js";

// The user class
class User {
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
    }

    // Saves a new user to the database
    save = async () =>
        new Promise((resolve, reject) => {
            pool.query(
                `\
                INSERT INTO user
                SELECT
                    '${this.id}',
                    '${this.name}',
                    '${this.surname}',
                    ${pool.escape(this.username)},
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
                `\
                UPDATE user
                SET
                    name = '${this.name}',
                    surname = '${this.surname}',
                    username = ${pool.escape(this.username)},
                    email = ${pool.escape(this.email)},
                    role = '${this.role}'
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
            pool.query("SELECT * FROM user", (error, results, fields) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

    // Finds a user using their id
    static findById = async (id) =>
        new Promise((resolve, reject) => {
            pool.query(
                "SELECT * FROM user WHERE id = ?;",
                id,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results[0]);
                }
            );
        });

    // Finds a user using their email
    static findByEmail = async (email) =>
        new Promise((resolve, reject) => {
            pool.query(
                "SELECT * FROM user WHERE email = ?;",
                email,
                (error, results, fields) => {
                    if (error) return reject(error);
                    resolve(results[0]);
                }
            );
        });

    // Deletes a user using their id
    static findByIdAndDelete = async (id) =>
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
