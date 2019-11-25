const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shopSchema = new Schema(
  {
    shop_name: {
      type: String
      //required: true
    },
    shop_latitude: {
      type: String
    },
    shop_longitude: {
      type: String
    },
    shop_description: {
      type: String
    },
    shop_rating: {
      type: String
    },
    shop_imagename: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
