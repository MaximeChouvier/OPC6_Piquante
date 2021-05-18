const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique},
  password: {type: String, required: true}
})