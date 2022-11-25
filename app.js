import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();
import express from "express";
import ejsMate from "ejs-mate";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import flash from "connect-flash";

import ExpressError from "./utils/ExpressError.js";
import { init } from "./models/db.js";
import User from "./models/user.js";
import usersRoutes from "./routes/users.js";
import buyersRoutes from "./routes/buyers.js";
import sellersRoutes from "./routes/sellers.js";

// Initializing the database. In a real app this would be replaced by
// a simple query to test the connection to the database
init();

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

// Setting up the session database
const store = new (MySQLStore(session))({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "akis11",
    database: process.env.DB_SESSION || "session",
});
store.on("error", (error) => console.log("Store error ", error));

// Setting up the session cookie
const secret = process.env.SECRET || "ProjectSecret";
const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
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

// Passing some stuff to the frontend
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.query = req.query;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Using my routes
app.use("/", usersRoutes);
app.use("/", buyersRoutes);
app.use("/", sellersRoutes);

// Sending a 404 error if the user tries to access a route that doesn't exist
app.all("*", (req, res, next) =>
    next(new ExpressError("Η σελίδα δεν βρέθηκε", 404))
);

// Sending a generic error message for errors that weren't handled elsewhere
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Κάτι πήγε στραβά!";
    res.status(status).render("error", { err, title: "Σφάλμα" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Serving on port", port));

export default app;
