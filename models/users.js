const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    phone: {
      type: String
    },
    address: {
        type: String
      },
    email: {
      type: String
    },
    password: {
      type: String
    },
    userimagename:{
      type: String
    },
    usertype: {
      type: String
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

userSchema.statics.checkCrediantialsDb = async (email, password) => {
  const user1 = await User.findOne({ email: email, password: password });
  if (user1) {
    return user1;
  }
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "techcenter", {
  });
  console.log(token);
  user.tokens = user.tokens.concat({ token: token });
  await user.save();

  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
