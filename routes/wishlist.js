const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlist");
const auth = require("../middleware/auth");

//ADDING TO WISHLIST ROUTE
router.post("/", (req, res) => {
    Wishlist.find({ email: req.body.email, product_name: req.body.product_name })
    .exec()
      .then(wishlist => {
        if (wishlist.length >= 1) {
          res.status(201).json({
            message_error: "Item already in wishlist"
          });
        } else {
          const wishlist = new Wishlist({
            email: req.body.email,
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            product_category:req.body.product_category,
            product_imagename:req.body.product_imagename
          });
          wishlist
            .save()
            .then(result => {
              res.status(201).json({
                message_success: "product added to wishlist successfully"
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                message: err
              });
            });
        }
      });
    });
  
  //GETTING WISHLIST OF A USER ROUTE
  router.get("/:email", function(req, res) {
    Wishlist.find({ email: req.params.email.toString() })
      .sort({ createdAt: -1 }) //sort in descending order
      .exec()
      .then(function(wishlist) {
        res.send(wishlist);
      })
      .catch(function(e) {
        res.send(e);
      });
  });
  
  //DELETING SINGLE PRODUCT FROM WISHLIST ROUTE
  router.delete("/removefromwishlist/:id", (req, res) => {
    Wishlist.findByIdAndDelete(req.params.id)
      .then(function() {
        res.send("Removed!");
      })
      .catch(function(e) {
        res.send(e);
      });
  });
  
  module.exports = router;