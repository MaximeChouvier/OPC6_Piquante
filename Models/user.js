require('dotenv').config()
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var encrypt = require("mongoose-encryption");

var encKey = process.env.ENC_KEY;
var sigKey = process.env.SIG_KEY;


const userSchema = mongoose.Schema({
  userId: {type: String, unique: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});


// userSchema.plugin(uniqueValidator);
// userSchema.plugin(encrypt, {
//   encryptionKey: encKey, 
//   signingKey: sigKey
// });

module.exports = mongoose.model('User', userSchema); 