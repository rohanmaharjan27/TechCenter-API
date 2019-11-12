const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Rating = require("../models/rating");

//ADDING RATING ROUTE
router.post("/", (req, res) => {
  Rating.find({ email: req.body.email, product_name: req.body.product_name })
    .exec()
    .then(rating => {
      if (rating.length >= 1) {
        res.status(201).json({
          message_error: "Rate Already Exists"
        });
      } else {
        const rating = new Rating({
          email: req.body.email,
          product_name: req.body.product_name,
          rating: req.body.rating
        });
        rating
          .save()
          .then(result => {
            res.status(201).json({
              message_success: "Success"
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

//INDIVIDUAL RATING ROUTE
router.post("/myRating", function(req, res) {
  try {
    Rating.find({ email: req.body.email, product_name: req.body.product_name })
      .exec()
      .then(function(rating) {
        res.send(rating);
      })
      .catch(function(e) {
        res.send(e);
      });
  } catch (e) {
    res.send(e);
  }
});

//UPDATING RATING ROUTE
router.put("/:id", function(req, res) {
  id = req.params.id.toString();
  Rating.update(
    { _id: id },
    {
      $set: {
        rating: req.body.rating
      }
    }
  )
    .then(function(rating) {
      res.status(201).json({
        message_success: "Rating Updated Successfully"
      });
    })
    .catch(function(e) {
      res.status(500).json({
        message: e
      });
    });
});

//TOTAL RATING ROUTE
router.get("/totalrating/:product_name", (req, res) => {
  Rating.find({ product_name: req.params.product_name })
    .select("rating")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        ratings: docs.map(doc => {
          return {
            rating: doc.rating
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});
module.exports = router;
