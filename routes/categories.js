const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const Category = require("../models/categories");

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
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/svg+xml"
  ) {
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



//ROUTE FOR ADDING CATEGORY
router.post(
  "/addCategory",
  auth,
  upload.single("product_category_image"),
  (req, res) => {
    Category.find({ product_category: req.body.product_category })
      .exec()
      .then(product => {
        if (product.length >= 1) {
          res.status(201).json({
            message_error: "Product Category already exists"
          });
        } else {
          const category = new Productcategory({
            product_category: req.body.product_category,
            product_category_imagename: req.file.path
          });
          category
            .save()
            .then(result => {
              res.status(201).json({
                message: "Product Category Added Successfully"
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                message: err
              });
            });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: err
        });
      });
  }
);

//ROUTE FOR GETTING ALL CATEGORIES
router.get("/", function(req, res) {
  Category.find()
    .sort({ createdAt: 1 }) //sort in ascending order
    .exec()
    .then(function(product) {
      res.send(product);
    })
    .catch(function(e) {
      res.send(e);
    });
});

//ROUTE FOR DELETING CATEGORY
router.delete("/deleteCategory/:id", auth, (req, res) => {
  Category.findById(req.params.id).then(product => {
    let path = product.product_category_imagename;
    fs.unlink(path, err => {
      if (err) console.log(err);
    });
    category
      .delete()
      .then(function(result) {
        res.status(201).json({
          message: "Product Category Deleted Successfully"
        });
      })
      .catch(function(e) {
        console.log(e);
      });
  });
});

module.exports = router;
