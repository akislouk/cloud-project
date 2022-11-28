import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();
import { createConnection, createPool } from "mysql";

const pool = createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB || "project",
});

pool.on("error", console.error.bind(console, "Connection error: "));

export default pool;

// Initializes the database
export function init() {
    // Connecting to the database
    const connection = createConnection({
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASS || "root",
        multipleStatements: true,
    });
    connection.connect();

    // Creating the databases if they don't exist
    connection.query(
        `\
        CREATE DATABASE IF NOT EXISTS ${process.env.DB_SESSION || "session"};
        CREATE DATABASE IF NOT EXISTS ${process.env.DB || "project"};`,
        (error) => {
            if (error) throw error;
            console.log("Schemas validated");
        }
    );

    // Creating the tables if they don't exist
    connection.query(
        `\
        USE ${process.env.DB || "project"};
        CREATE TABLE IF NOT EXISTS user (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            name VARCHAR(50) NOT NULL,
            surname VARCHAR(50) NOT NULL,
            username VARCHAR(50) NOT NULL,
            salt CHAR(22) NOT NULL,
            hash BINARY(64) NOT NULL,
            email VARCHAR(255) NOT NULL,
            role ENUM('admin', 'product seller', 'user') DEFAULT 'user',
            confirmed BOOLEAN DEFAULT FALSE,
            PRIMARY KEY (id),
            UNIQUE KEY (username),
            UNIQUE KEY (email)
        );
        CREATE TABLE IF NOT EXISTS product (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            product_code VARCHAR(50) NOT NULL,
            price DECIMAL(8, 2) NOT NULL,
            date_of_withdrawal DATETIME,
            seller_name VARCHAR(50) NOT NULL,
            category VARCHAR(50) NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (seller_name)
                REFERENCES user (username)
                ON UPDATE CASCADE ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS cart (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id INT UNSIGNED NOT NULL,
            product_id INT UNSIGNED NOT NULL,
            date_of_insertion DATETIME NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id)
                REFERENCES user (id)
                ON UPDATE CASCADE ON DELETE CASCADE,
            FOREIGN KEY (product_id)
                REFERENCES product (id)
                ON UPDATE CASCADE ON DELETE CASCADE
        );`,
        (error) => {
            if (error) throw error;
            console.log("Tables validated");
        }
    );

    // Creating the admin if they don't exist
    connection.query(
        `\
        INSERT INTO user (name, surname, username, salt, hash, email, role, confirmed)
        SELECT 'Σπύρος', 'Λουκάτος', 'admin', '${process.env.ADMIN_SALT}', UNHEX('${process.env.ADMIN_HASH}'), 'admin@tuc.gr', 'admin', 1;`,
        (error) => {
            if (error) console.log(error.sqlMessage);
            console.log("Admin validated");
        }
    );

    // Ending the connection
    connection.end();
}
