const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const Product = require("../models/products");

const storage = multer.diskStorage({
  destination: function(req, res, cb) {
    cb(null, "./images");
  },
  filename: function(req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, "product" + Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("File format not supported"), false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10 //10MB
  },
  fileFilter: fileFilter
});


//ADD A PRODUCT ROUTE
router.post("/addProduct", upload.single("product_image"), (req, res) => {
  const product = new Product({
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_category: req.body.product_category,
    product_description: req.body.product_description,
    product_manufacturer: req.body.product_manufacturer,
    product_imagename: req.file.path,
    product_rating: "0",
    product_offer: req.body.product_offer
  });
  product
    .save()
    .then(result => {
      res.status(201).json({
        message: "Product Added Successfully!"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: err
      });
    });
});

//GET ALL PRODUCTS ROUTE
router.get("/", function(req, res) {
  Product.find()
    .sort({ createdAt: -1 }) //descending order
    .exec()
    .then(function(product) {
      res.send(product);
    })
    .catch(function(e) {
      res.send(e);
    });
});

//GET PRODUCTS WITH OFFER ROUTE
router.get("/offerproduct", function(req, res) {
  var text = "Yes";
  Product.find({ product_offer: text })
    .sort({ createdAt: -1 }) //descending order
    .exec()
    .then(function(product) {
      res.send(product);
    })
    .catch(function(e) {
      res.send(e);
    });
});

//GET PRODUCTS ACCORDING TO CATEGORY ROUTE
router.get("/product/:product_category", function(req, res) {
  Product.find({ product_category: req.params.product_category })
    .sort({ createdAt: -1 }) //sort in descending order
    .exec()
    .then(function(product) {
      res.send(product);
    })
    .catch(function(e) {
      res.send(e);
    });
});

module.exports = router;
