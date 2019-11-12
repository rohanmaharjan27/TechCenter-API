const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new Schema(
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
    product_category:{
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

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
