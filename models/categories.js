const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    product_category: {
      type: String
    },
    product_category_imagename: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
