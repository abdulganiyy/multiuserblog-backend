const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  avatar: String,
  bio: String,
  job: String,
  createdAt: Date,
});

module.exports = model("User", userSchema);
