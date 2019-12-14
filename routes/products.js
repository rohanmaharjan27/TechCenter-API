const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const Product = require("../models/products");

// const storage = multer.diskStorage({
//   destination: function(req, res, cb) {
//     cb(null, "./images");
//   },
//   filename: function(req, file, cb) {
//     let ext = path.extname(file.originalname);
//     cb(null, "product" + Date.now() + file.originalname);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(new Error("File format not supported"), false);
//   }
// };
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 10 //10MB
//   },
//   fileFilter: fileFilter
// });

// //PRODUCT IMAGE UPLOAD
// router.post('/imageupload',upload.single("imageFile"), (req, res) => {
    
//   res.writeHead(200, { "Content-Type": "application/json" });
//   res.end(
//     JSON.stringify(
//       {
//         imageFile: ImagefileName
//       },
//       null,
//       3
//     )
//   );
// });


var ImagefileName;
var storage=multer.diskStorage({
    destination:"images",
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        ImagefileName = file.fieldname + "-" + Date.now() + ext;
        callback(null, ImagefileName);
      }
})

   const newError="Image Files Only!";
    var imageFileFilter = (req, file, cb) => {
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
    {return cb(newError, false); }
    cb(null, true);};
   
    var imageupload = multer({
    storage: storage});


router.post('/imageupload',imageupload.single("imageFile"), (req, res) => {
    
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify(
        {
          imageFile: ImagefileName
        },
        null,
        3
      )
    );
  });

//ADD A PRODUCT ROUTE
router.post("/addProduct", imageupload.single("imageFile"), (req, res) => {
  const product = new Product({
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_category: req.body.product_category,
    product_description: req.body.product_description,
    product_manufacturer: req.body.product_manufacturer,
    product_imagename: req.body.product_imagename,
    product_rating: "1"
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

router.delete('/deleteproduct/:id',auth,function(req,res){
  Product.findByIdAndDelete(req.params.id).then(function(){
      res.json("Deleted!");
  }).catch(function(e){
      res.send(e);
  })
})

module.exports = router;
