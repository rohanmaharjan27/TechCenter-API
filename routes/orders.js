
const moment = require("moment");
const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const auth = require("../middleware/auth");

//route for adding order
router.post("/", (req, res) => {
  const order = new Order({
    email: req.body.email,
    product_name: req.body.product_name,
    product_quantity: req.body.product_quantity,
    product_price: req.body.product_price,
    product_imagename: req.body.product_imagename,
    payment_type: req.body.payment_type,
    date: moment(),
    status: "InTransit"
  });
  order
    .save()
    .then(result => {
      res.status(201).json({
        message: "Order Success"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: err
      });
    });
});

//route for adding order
router.post("/multiple", (req, res) => {
  const order = new Order({
    email: req.body.email,
    product_name: req.body.product_name,
    product_quantity: req.body.product_quantity,
    product_price: req.body.product_price,
    product_imagename: req.body.product_imagename,
    date: moment(),
    status: "InTransit"
  });
  order
    .save()
    .then(result => {
      res.status(201).json({
        message: "Order Success"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: err
      });
    });
});

//route for getting all orders
router.get("/", function(req, res) {
  Order.find({})
    .sort({ createdAt: -1 }) //sort in descending order
    .exec()
    .then(function(order) {
      res.send(order);
    })
    .catch(function(e) {
      res.send(e);
    });
});

//route for getting all orders of particular user
router.get("/:email", function(req, res) {
  Order.find({email:req.params.email})
    .sort({ createdAt: -1 }) //sort in descending order
    .exec()
    .then(function(order) {
      res.send(order);
    })
    .catch(function(e) {
      res.send(e);
    });
});

module.exports = router;
