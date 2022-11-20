if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const mysql = require("mysql");
const MySQLStore = require("express-mysql-session")(session);

const ExpressError = require("./utils/ExpressError");
// const usersRoutes = require("./routes/users");
// const User = require("./models/user");

const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "akis11",
});

connection.connect();
connection.query(
    "CREATE DATABASE IF NOT EXISTS " + process.env.DB || "project",
    function (error) {
        if (error) throw error;
        console.log("Project database created");
    }
);
connection.query(
    "CREATE DATABASE IF NOT EXISTS " + process.env.DB_SESSION || "session",
    function (error) {
        if (error) throw error;
        console.log("Session database created");
    }
);
connection.end();

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

const secret = process.env.SECRET || "ProjectSecret";
const store = new MySQLStore({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "akis11",
    database: process.env.DB_SESSION || "session",
});
store.on("error", (error) => console.log("STORE ERROR ", error));

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

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.query = req.query;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// app.use("/users", usersRoutes);

// Homepage
app.get("/", (req, res) =>
    res.render("home", {
        title: "Cloud",
    })
);

// Sends back a 404 error if the user tries to access a route that doesn't exist
app.all("*", (req, res, next) =>
    next(new ExpressError("Η σελίδα δεν βρέθηκε", 404))
);

// Generic error message for errors that we haven't handled elsewhere
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Κάτι πήγε στραβά!";
    res.status(statusCode).render("error", { err, title: "Error" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serving on port ${port}`));

module.exports = app;
