const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./Models/user");
const userRoutes = require("./Routes/user")
const sauceRoutes = require("./Routes/sauce")
const cors = require("cors")
const path = require('path');
const app = express();


// ↓↓ Accès pour supprimer ou modifier des tables ↓↓ //
// ↓↓                 (Atlas Admin)               ↓↓ //

mongoose.connect('mongodb+srv://admin:admin@cluster0.db9o0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



// ↓↓  Accès pour éditer le contenu de la base de données   ↓↓ //
// ↓↓ ReadWrite(collection users) & Read(collection sauces) ↓↓ //

// mongoose.connect('mongodb+srv://regular:regular@cluster0.db9o0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
//   { useNewUrlParser: true,
//     useUnifiedTopology: true })
//   .then(() => console.log('Connexion à MongoDB réussie !'))
//   .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use(cors())
app.use(bodyParser.json());

app.use('./Images', express.static(path.join(__dirname, 'Images')));
app.use("/api/auth", userRoutes)
app.use("/api/sauces", sauceRoutes)

module.exports = app;