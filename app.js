const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./Models/user");
const userRoutes = require("./Routes/user")

const app = express();

mongoose.connect('mongodb+srv://admin:admin@cluster0.db9o0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.status(200).json({message: "ok"})
  next();
});

app.use("/api/auth/signup", userRoutes)


module.exports = app;

