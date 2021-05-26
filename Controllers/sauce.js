const Sauce = require('../Models/sauce.js')
const bodyParser = require("body-parser");

exports.addSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  const newSauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/Images/${req.file.filename}`
  });
  console.log(newSauce)
  newSauce.save()
    .then(() => res.status(200).json({message: "Nouvelle sauce crée"}))
    .catch(error => res.status(400).json({error}));
  console.log("Nouvelle sauce crée");
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(Sauce => res.status(200).json(Sauce))
    .catch(error => res.status(400).json({error}))
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(Sauce => res.status(200).json(Sauce))
    .catch(error => res.status(404).json({ error }));
}