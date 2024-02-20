import { createPool } from "mysql2";

const pool = createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "project",
    multipleStatements: true,
});

pool.on("error", console.error.bind(console, "MySQL Connection error: "));
pool.once("connection", () => console.log("MySQL connected"));

export default pool;
