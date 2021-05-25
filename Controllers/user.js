const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/user")


exports.signup = (req, res, next) => {
  console.log("Signup en cours")
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const newUser = new User({
        email: req.body.email,
        password: hash
      });
      newUser.save()
        .then(() => res.status(201).json({message: "Nouvel utilisateur crée !"}))
        .catch(error => res.status(400).json({ error }));
      console.log("Utilisateur Crée")
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {

};