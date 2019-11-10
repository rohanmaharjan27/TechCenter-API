const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    email: {
      type: String
    },
    product_name: {
      type: String
    },
    product_quantity: {
      type: String
    },
    product_price: {
      type: String
    },
    date: {
      type: Date
    },
    status: {
      type: String
    },
    product_imagename: {
      type: String
    },
    payment_type: {
      type:String
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
