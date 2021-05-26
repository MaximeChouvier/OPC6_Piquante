const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./Models/user");
const userRoutes = require("./Routes/user")
const sauceRoutes = require("./Routes/sauce")
const cors = require("cors")


const app = express();

mongoose.connect('mongodb+srv://admin:admin@cluster0.db9o0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(cors())
app.use(bodyParser.json());
// app.use(bodyParser.text());
// app.use(bodyParser.urlencoded())


app.use("/api/auth", userRoutes)
app.use("/api/sauces", sauceRoutes)

module.exports = app;

