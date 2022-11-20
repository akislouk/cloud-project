const mysql = require("mysql");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "akis11",
    database: process.env.DB || "project",
});

pool.on("error", console.error.bind(console, "connection error:"));

module.exports = pool;
