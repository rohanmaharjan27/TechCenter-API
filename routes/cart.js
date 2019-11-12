const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const auth = require("../middleware/auth");

//ADDING TO CART ROUTE
router.post("/", (req, res) => {
  Cart.find({ email: req.body.email, product_name: req.body.product_name })
  .exec()
    .then(cart => {
      if (cart.length >= 1) {
        res.status(201).json({
          message_error: "Item already in cart"
        });
      } else {
        const cart = new Cart({
          email: req.body.email,
          product_name: req.body.product_name,
          product_price: req.body.product_price,
          product_quantity:req.body.product_quantity,
          product_imagename:req.body.product_imagename
        });
        cart
          .save()
          .then(result => {
            res.status(201).json({
              message_success: "product added to cart successfully"
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

//GETTING CART OF A USER ROUTE
router.get("/:email", function(req, res) {
  Cart.find({ email: req.params.email.toString() })
    .sort({ createdAt: -1 }) //sort in descending order
    .exec()
    .then(function(cart) {
      res.send(cart);
    })
    .catch(function(e) {
      res.send(e);
    });
});

//DELETING SINGLE PRODUCT FROM CART ROUTE
router.delete("/removefromcart/:id", (req, res) => {
  Cart.findByIdAndDelete(req.params.id)
    .then(function() {
      res.send("Removed!");
    })
    .catch(function(e) {
      res.send(e);
    });
});

module.exports = router;
