const Sauce = require('../Models/sauce.js')
const bodyParser = require("body-parser");
const fs = require("fs");

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
    .catch(error => res.status(400).json({error}));
}

exports.getOneSauce = (req, res, next) => {
  console.log("l'ID de la sauce: " + req.params.id)
  Sauce.findOne({ _id: req.params.id })
    .then(Sauce => res.status(200).json(Sauce))
    .catch(error => res.status(404).json({ error }));

  // ↓ Pour supprimer la sauce séléctionnée en cas de soucis ↓
  
  // Sauce.findOne({ _id: req.params.id})
  // .then(Sauce => {
  //   const filename = Sauce.imageUrl.split("/Images/")[1];
  //   fs.unlink(`Images/${filename}`,() => {
  //     Sauce.deleteOne({ _id: req.params.id })
  //     .then(() => res.status(200).json({message: "Sauce supprimée"}))
  //     .catch(error => res.status(400).json({error}))
  //   });
  // })
  // .catch(error => res.status(500).json({error}))
}

exports.updateSauce = (req, res , next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/Images/${req.file.filename}`
    } : {...req.body};
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(Sauce => res.status(200).json(Sauce))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res ,next) => {
  Sauce.findOne({ _id: req.params.id})
    .then(Sauce => {
      const filename = Sauce.imageUrl.split("/Images/")[1];
      fs.unlink(`Images/${filename}`,() => {
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({message: "Sauce supprimée"}))
        .catch(error => res.status(400).json({error}))
      });
    })
    .catch(error => res.status(500).json({error}))
};

exports.likeSauce = (req, res ,next) => {
let sauceObject = Sauce.findOne({_id: req.params})
console.log(sauceObject)
const sauceId = req.params;
const userLiking = req.body.userId;
const likeStatus = req.body.like;

  if (likeStatus == 1) {
    likeSauce(sauceId, userLiking)
  } else if (likeStatus == -1) {
    dislikeSauce(sauceId, userLiking)
  }
}

function likeSauce(){

console.log("Sauce liked")
}

function dislikeSauce(){

  console.log("Sauce disliked")
}