var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  userFirstName: String,
  userLastName: String,
  city: String,
  state: String,
  zipCode: String,
  country: String
});

module.exports = mongoose.model("User", userSchema);
