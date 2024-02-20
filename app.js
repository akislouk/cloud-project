// dotenv config import
import "./config.js";

// Third-party imports
import express from "express";
import ejsMate from "ejs-mate";
import methodOverride from "method-override";
import session from "express-session";
import flash from "connect-flash";
import MySQLStore from "express-mysql-session";
import { connect, connections, set } from "mongoose";
import mongoSanitize from "express-mongo-sanitize";

// Node imports
import { fileURLToPath } from "url";
import { join, dirname } from "path";

// First-party imports
import ExpressError from "./utils/ExpressError.js";
import pool from "./models/db.js";
import User from "./models/user.js";
import productsRoutes from "./routes/products.js";
import sellersRoutes from "./routes/sellers.js";
import usersRoutes from "./routes/users.js";

// Making sure the user table and the admin exist
pool.query(
    `\
    CREATE TABLE IF NOT EXISTS user (
        id VARCHAR(50) NOT NULL,
        name VARCHAR(50) NOT NULL,
        surname VARCHAR(50) NOT NULL,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        role ENUM('admin', 'product seller', 'user') DEFAULT 'user',
        PRIMARY KEY (id),
        UNIQUE KEY (username),
        UNIQUE KEY (email)
    ) DEFAULT CHARSET=utf8;
    INSERT INTO user
    SELECT 'admin', 'Σπύρος', 'Λουκάτος', 'admin', 'admin@tuc.gr', 'admin';`,
    (error) => {
        if (error) console.log(error.sqlMessage);
        console.log("Tables validated");
    }
);

// Connecting to MongoDB
const dbUrl = process.env.DB_URL || "mongodb://0.0.0.0:27017/app";
set("strictQuery", true);
connect(dbUrl);
const db = connections[0];
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("MongoDB connected"));

// Creating the Express application
const app = express();

// Getting the root folder in file URL format
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setting EJS as the template engine and setting the views folder
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public"))); // Setting the static content folder
app.use(methodOverride("_method")); // Setting the parameter that will be used to override request methods
app.use(mongoSanitize({ replaceWith: "_" })); // Replacing "dangerous" characters from incoming requests

// Setting up the session database
const store = new (MySQLStore(session))({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "project",
});
store.on("error", (error) => console.log("Store error ", error));

// Setting up the session cookie
const sessionConfig = {
    name: "cloud_session",
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET || "ProjectSecret",
    store,
    cookie: {
        httpOnly: true,
        sameSite: "strict",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};
app.use(session(sessionConfig));

// Using flash messages. Flash messages are added to the session cookie
app.use(flash());

// Saving the current user to the request object
app.use(async (req, res, next) => {
    if (req.session.user) req.user = await User.findById(req.session.user);
    else req.user = null;
    next();
});

// Sending the user's info and flash messages to the frontend
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Using my routes
app.use("/", productsRoutes);
app.use("/", sellersRoutes);
app.use("/", usersRoutes);

// Sending a 404 error if the user tries to access a route that doesn't exist
app.all("*", (req, res, next) => next(new ExpressError("Η σελίδα δεν βρέθηκε", 404)));

// Sending a generic error message for errors that weren't handled elsewhere
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Κάτι πήγε στραβά!";
    res.status(status).render("error", { err, title: "Σφάλμα" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Serving on port", port));

export default app;
