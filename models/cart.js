const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    email: {
      type: String
    },
    product_name: {
      type: String
    },
    product_price: {
      type: String
    },
    product_quantity:{
      type:String
    },
    product_imagename:{
      type:String
    }
  },
  {
    timestamps: true
  }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
