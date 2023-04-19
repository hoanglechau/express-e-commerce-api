const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      // use the validator package to check with a regex pattern to see if the email format is correct
      validator: validator.isEmail,
      message: "Please provide valid email"
    }
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  }
});

// Hash the password with the bcrypt package
// Use "normal" function instead of arrow function because we want "this" to point to the User
UserSchema.pre("save", async function() {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
