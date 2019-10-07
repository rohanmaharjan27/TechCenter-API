const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/users");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function(req, res, cb) {
    cb(null, "./images");
  },
  filename: function(req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, "food" + Date.now() + file.originalname);
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

//SIGN UP ROUTE
router.post("/register", (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        res.status(201).json({
          message_error: "Email already exists"
        });
      } else {
        const user = new User({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          phone: req.body.phone,
          address: req.body.address,
          email: req.body.email,
          password: req.body.password,
          userimagename: req.body.userimagename,
          usertype: "user"
        });
        user
          .save()
          .then(result => {
            res.status(201).json({
              message_success: "Register Successful"
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
      res.status(500).json({
        message: err
      });
    });
});

//GETTING USER DETAILS ROUTE
router.get("/me", auth, function(req, res) {
  res.send(req.user);
});

//LOGIN ROUTE
router.post("/login", async function(req, res) {
  try {
    const user = await User.checkCrediantialsDb(
      req.body.email,
      req.body.password
    );

    if (user) {
      const token = await user.generateAuthToken();
      res.status(201).json({
        token: token,
        user: user,
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        password: user.password,
        userimagename: req.body.userimagename,
        usertype: user.usertype
      });
    } else {
      res.json({
        message: "Invalid"
      });
    }
  } catch (e) {
    console.log(e);
  }
});

//LOGOUT ROUTE
router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status("201").json({
      message: "Success"
    });
  } catch (e) {
    res.status(500).send();
  }
});

//PROFILE UPDATE ROUTE
router.put("/updateUser/:id", function(req, res) {
  uid = req.params.id;
  User.update(
    { _id: uid },
    {
      $set: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        address: req.body.address,
        email: req.body.email,
        userimagename: req.body.userimagename,
        password: req.body.password
      }
    }
  )
    .then(function(user) {
      res.status(201).json({
        message: "Profile Updated Successfully"
      });
    })
    .catch(function(e) {
      res.status(422).json({
        message: "Unable to Update:" + e
      });
    });
});

module.exports = router;
