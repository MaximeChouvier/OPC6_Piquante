const Sauce = require('../Models/sauce.js')
const bodyParser = require("body-parser");
const fs = require("fs");
const sauce = require('../Models/sauce.js');
const { update } = require('../Models/sauce.js');

exports.addSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  const newSauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/Images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  console.log(newSauce)
  newSauce.save()
    .then(() => res.status(200).json({message: "Nouvelle sauce crée"}))
    .catch(error => res.status(400).json({error}));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(Sauce => res.status(200).json(Sauce))
    .catch(error => res.status(400).json({error}));
}

exports.getOneSauce = (req, res, next) => {
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

exports.deleteSauce = (req, res , next) => {
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
  const sauceId = req.params.id;
  const userRequest = req.body.userId;
  const likeStatus = req.body.like;
  Sauce.findById(sauceId)
    .then(result => {
      let sauceObject = result;
      const usersLiked = sauceObject.usersLiked;
      const usersDisliked = sauceObject.usersDisliked;
      
      if (likeStatus == 1 && usersLiked !== userRequest) {
        likeSauce(res, sauceId, sauceObject, usersLiked, userRequest)
      } else if (likeStatus == -1 && usersDisliked !== userRequest) {
        dislikeSauce(res, sauceId, sauceObject, usersDisliked, userRequest)
      } else if (likeStatus == 0) {
        unlikeSauce(res, likeStatus, sauceObject, userRequest)
      }
    })
    .catch(error => res.status(400).json({error}))
}

async function likeSauce(res, sauceId, sauceObject, usersLiked, userRequest){
  usersLiked.push(userRequest);
  let update = await {likes: sauceObject.likes + 1, usersLiked: usersLiked};
  Sauce.findOneAndUpdate(sauceId, update)
    .then(() => res.status(200).json())
    .catch(error => res.status(400).json({ error }));
}

async function dislikeSauce(res, sauceId, sauceObject, usersDisliked, userRequest){
  usersDisliked.push(userRequest);
  let update = await {dislikes: sauceObject.dislikes - 1, usersDisliked: usersDisliked}
  Sauce.findOneAndUpdate(sauceId, update)
  .then(() => res.status(200).json())
  .catch(error => res.status(400).json({ error }));
}

function unlikeSauce(res, likeStatus, sauceObject, userRequest){


  console.log("Sauce unliked")
}