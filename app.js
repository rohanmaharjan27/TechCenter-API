const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("./dbHelper/mongoose");

const userRoute = require("./routes/users");
const productRoute = require("./routes/products");
const ratingRoute = require("./routes/rating");
const orderRoute = require("./routes/orders");
const cartRoute = require("./routes/cart");
const wishlistRoute = require("./routes/wishlist");

app.use("/images", express.static("images"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

//CORS ERROR HANDLING
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/users", userRoute);
app.use("/products",productRoute);
app.use("/ratings",ratingRoute);
app.use("/carts",cartRoute);
app.use("/wishlists",wishlistRoute);
app.use("/orders",orderRoute);

//ERROR HANDLING
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
