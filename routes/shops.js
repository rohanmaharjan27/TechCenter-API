const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const Shop = require("../models/shops");

const storage = multer.diskStorage({
  destination: function(req, res, cb) {
    cb(null, "./images");
  },
  filename: function(req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, "shop" + Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    //accept
    cb(null, true);
  } else {
    //reject a file
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

//ROUTE FOR ADDING SHOPS
router.post("/addShop", upload.single("shop_image"), (req, res) => {
  const shop = new Shop({
    shop_name: req.body.shop_name,
    shop_latitude: req.body.shop_latitude,
    shop_longitude: req.body.shop_longitude,
    shop_description: req.body.shop_description,
    shop_rating: req.body.shop_rating,
    shop_imagename: req.file.path
  });
  shop
    .save()
    .then(result => {
      res.status(201).json({
        message: "Shop Added Successfully"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: err
      });
    });
});

//route for getting all food
router.get("/shop", function(req, res) {
  Shop.find()
    .sort({ createdAt: -1 }) //sort in descending order
    .exec()
    .then(function(rest) {
      res.send(rest);
    })
    .catch(function(e) {
      res.send(e);
    });
});

module.exports = router;
