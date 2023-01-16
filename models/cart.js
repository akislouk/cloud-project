import { Schema, model } from "mongoose";

const CartSchema = new Schema({
    user: { type: String, require: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", require: true },
    dateOfInsertion: { type: Date, default: () => Date.now() },
});

const Cart = model("Cart", CartSchema);
export default Cart;
