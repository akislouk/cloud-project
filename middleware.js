// Checks if the user is logged in
export const isLoggedIn = (req, res, next) => {
    if (req.session.user) next();
    else {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Πρέπει να συνδεθείτε πρώτα!");
        res.redirect("/index.php");
    }
};
