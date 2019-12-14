const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/users");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

var ImagefileName;
var storage = multer.diskStorage({
    destination: 'user-images',
    filename: function (req, file, callback) {
        const extension = path.extname(file.originalname);
        ImagefileName= file.fieldname+Date.now()+ extension;
         callback(null, ImagefileName);
       
    }
});

    var imageFileFilter = (req, file, cb) => {if
        (!file.originalname.match(/\.(jpg|jpeg|PNG|png|gif)$/))
         {return cb(new Error("You can upload only image files!"), false); }
         cb(null, true);};

            var upload = multer({
                storage: storage,
                fileFilter: imageFileFilter,
                limits: {
                    fileSize: 25000000
                }
            });
            router.post('/userImageUpload', upload.single('profileImage'), (req, res) => { 
              res.statusCode = 200;
              res.json({"userImageName":ImagefileName});
             })

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

//GET ALL USERS ROUTE (DONE BY ADMIN)
router.get("/", function(req, res) {
  User.find()
    .sort({ createdAt: -1 }) //descending order
    .exec()
    .then(function(user) {
      res.send(user);
    })
    .catch(function(e) {
      res.send(e);
    });
});

//GETTING USER DETAILS ROUTE
router.get("/profile", auth, function(req, res) {
  res.send(req.user);
});

//TOKEN CHECK
router.get("/check",auth,function(req,res){
  res.send(req.user);
})

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

//GETTING DATA FROM USERS TABLE (DONE BY ADMIN)
router.get('/', function(req, res)
        { User.find({usertype:"user"}).then(function(user)
            {
                res.send(user);
        })
        .catch(function(e){     
            res.send(e) }); 
        })

//PROFILE UPDATE ROUTE
router.put('/updateUser/:email',(req,res)=>{
  email=req.params. email
  User.findOneAndUpdate({email:email},req.body,{new:true}).then(function(user){
    res.send(true);
  }).catch(function(e){
    res.send(e)
  })
})

module.exports = router;
