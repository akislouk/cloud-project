import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const products = (req, res) => res.redirect("/products.php");

// Finds products based on the URL search params and sends them to the frontend
export const index = async (req, res, next) => {
    try {
        // Destructuring the request query object
        const { product, seller, category, date } = req.query;
        let min = 0;
        let max = 999999.99;

        // Validating the min/max values
        if (req.query.min) {
            if (req.query.max)
                if (parseFloat(req.query.min) < parseFloat(req.query.max)) {
                    min = req.query.min;
                    max = req.query.max;
                } else {
                    min = req.query.max;
                    max = req.query.min;
                }
            else min = req.query.min;
        } else req.query.max && (max = req.query.max);

        // Setting up the query
        const query = { price: { $gte: min, $lte: max } };
        product && (query.name = new RegExp(product, "i"));
        date &&
            (query.dateOfWithdrawal = {
                $gte: new Date(date + " 00:00"),
                $lte: new Date(date + " 23:59"),
            });
        seller && (query.seller = new RegExp(seller, "i"));
        category && (query.category = new RegExp(category, "i"));

        // Finding the products in the database
        res.locals.products = await Product.find(query).lean();

        // Turning the prices to the Greek price format
        res.locals.products.forEach((product) => {
            product.price = new Intl.NumberFormat("el-GR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(product.price);
        });

        // Finding the min and max prices in the database to initialize the inputs
        res.locals.price = {
            min: await Product.findMinPrice(),
            max: await Product.findMaxPrice(),
        };

        res.render("products", { title: "Κεντρική" });
    } catch (error) {
        next(error);
    }
};

// Add a product to the user's cart
export const addToCart = async (req, res, next) => {
    // Creating a cart using the Cart class constructor
    const cart = new Cart({ user: req.user.id, product: req.query.pid });

    // Saving the cart to the database
    await cart
        .save()
        .then(() =>
            res.status(200).send(`\
                <div class="toast align-items-center text-bg-success fade show border-0 position-fixed bottom-0 end-0 z-index-1 me-3 mb-5"
                    role="status" aria-live="polite" aria-atomic="true">
                    <div class="d-flex justify-content-between fs-6">
                        <div class="toast-body">
                            Το προϊόν προστέθηκε στο <a class="text-reset" href="/cart.php">καλάθι</a> σας.
                        </div>
                        <div class="toast-body d-flex">
                            <button class="btn-close btn-close-white mb-auto" data-bs-dismiss="toast" type="button"
                                aria-label="Close"></button>
                        </div>
                    </div>
                </div>
                <script src="/scripts/toast.js" type="module"></script>`)
        )
        .catch((error) =>
            res.status(500).send(`\
                <div class="toast align-items-center text-bg-danger fade show border-0 position-fixed bottom-0 end-0 z-index-1 me-3 mb-5"
                    role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex justify-content-between fs-6">
                        <div class="toast-body">
                            Κάτι πήγε στραβά. <br>
                            ${error}
                        </div>
                        <div class="toast-body d-flex">
                            <button class="btn-close btn-close-white mb-auto" data-bs-dismiss="toast" type="button"
                                aria-label="Close"></button>
                        </div>
                    </div>
                </div>
                <script src="/scripts/toast.js" type="module"></script>`)
        );
};

export const cart = (req, res) => res.redirect("/cart.php");

// Finds the products in the user's cart and sends them to the frontend
export const show = async (req, res, next) => {
    try {
        res.locals.carts = await Cart.find({ user: req.user.id })
            .populate("product")
            .lean();
        res.render("products/cart", { title: "Καλάθι Αγορών" });
    } catch (error) {
        next(error);
    }
};

// Deletes a product from the user's cart
export const destroy = async (req, res, next) => {
    try {
        await Cart.findByIdAndDelete(req.query.cid);

        // Sending success message
        res.status(200).send(`\
            <div class="toast align-items-center text-bg-success fade show border-0 position-fixed bottom-0 end-0 z-index-1 me-3 mb-5"
                role="status" aria-live="polite" aria-atomic="true">
                <div class="d-flex justify-content-between fs-6">
                    <div class="toast-body">
                        Το προϊόν αφαιρέθηκε από το καλάθι σας.
                    </div>
                    <div class="toast-body d-flex">
                        <button class="btn-close btn-close-white mb-auto" data-bs-dismiss="toast" type="button"
                            aria-label="Close"></button>
                    </div>
                </div>
            </div>
            <script src="/scripts/toast.js" type="module"></script>`);
    } catch (error) {
        next(error);
    }
};
