const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    product_name: {
      type: String
    },
    product_price: {
        type: String
      },
    product_category: {
      type: String
    },
    product_description: {
      type: String
    },
    product_manufacturer: {
        type: String
      },
    product_imagename: {
      type: String
    },
    product_rating: {
      type: Number
    },
    product_offer: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
