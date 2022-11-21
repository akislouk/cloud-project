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

// initializing the database
init();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));
app.use(methodOverride("_method"));

// setting up session database
const store = new (MySQLStore(session))({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "akis11",
    database: process.env.DB_SESSION || "session",
});
store.on("error", (error) => console.log("Store error ", error));

// setting up session cookie
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
app.use(flash());

// setting the current user to the request object
app.use(async (req, res, next) => {
    if (req.session.user_id)
        req.user = await User.findById(req.session.user_id);
    else req.user = null;
    next();
});

// passing stuff to the frontend
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.query = req.query;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// using my routes
app.use("/", usersRoutes);

// sending a 404 error if the user tries to access a route that doesn't exist
app.all("*", (req, res, next) =>
    next(new ExpressError("Η σελίδα δεν βρέθηκε", 404))
);

// generic error message for errors that weren't handled elsewhere
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Κάτι πήγε στραβά!";
    res.status(statusCode).render("error", { err, title: "Σφάλμα" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Serving on port", port));

export default app;
