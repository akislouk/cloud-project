import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
    {
        name: { type: String, require: true },
        code: { type: String, require: true },
        price: { type: Schema.Types.Decimal128, require: true },
        dateOfWithdrawal: Date,
        seller: { type: String, require: true },
        category: { type: String, require: true },
    },
    {
        statics: {
            // Finds and returns products using a seller's username
            findByUsername(username) {
                return this.find({ seller: username });
            },
            // Finds and returns the minimum product price
            async findMinPrice() {
                const product = await this.find().sort({ price: 1 }).limit(1).lean();
                return product.length > 0 ? product[0].price : 0;
            },
            // Finds and returns the maximum product price
            async findMaxPrice() {
                const product = await this.find().sort({ price: -1 }).limit(1).lean();
                return product.length > 0 ? product[0].price : 999999.99;
            },
        },
    }
);

const Product = model("Product", ProductSchema);
export default Product;
