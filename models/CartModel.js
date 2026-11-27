import mongoose from "mongoose";

const CartItem = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      deafult: 1,
    },
    price: { type: Number, required: true },
    images: {
      type: [String],
      required: true,
    },
  },
  { _id: false },
);

const CartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    guestId: {
      type: String,
      default: null,
    },
    cartItems: {
      type: [CartItem],
      default: [],
    },
  },
  { timestamps: true },
);

const CartModel = mongoose.Schema("Cart", CartSchema);
export default CartModel;
