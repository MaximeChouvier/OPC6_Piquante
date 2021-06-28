const Sauce = require('../Models/sauce.js')
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose")
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


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
}

exports.updateSauce = (req, res , next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/Images/${req.file.filename}`,
    } : {...req.body};
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(Sauce => res.status(200).json(Sauce))
    .catch(error => res.status(400).json({ error }));
};

// function deleteOldImage(){
//   console.log({Sauce})
//   const oldFilename = Sauce.imageUrl.split("/Images/")[1];
//   fs.unlink(`Images/${oldFilename}`)
//     .then(() => res.status(200).json({message: "l'ancienne image à été supprimée"}))
//     .catch(error => res.status(400).json({error}))
// }

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
  var userId = req.body.userId;
  const userRequest = req.body.like;

  Sauce.findById(sauceId)
    .then(result => {
      let sauceObject = result;
      const usersLiked = sauceObject.usersLiked;
      const usersDisliked = sauceObject.usersDisliked;
      
      if (userRequest == 1 && usersLiked.includes(userId) == false){
        likeSauce(res, sauceId, sauceObject, usersLiked, userId)
      } else if (userRequest == -1 && usersDisliked.includes(userId) == false){
        dislikeSauce(res, sauceId, sauceObject, usersDisliked, userId)
      } else if (userRequest == 0) {
        unlikeSauce(res, sauceId, sauceObject, usersLiked, usersDisliked, userId)
      } else {
        throw({error})
      }
    })
  .catch(error => res.status(400).json({error}))
}

function likeSauce(res, sauceId, sauceObject, usersLiked, userId){
  usersLiked.push(userId);
  let update = {likes: sauceObject.likes + 1, usersLiked: usersLiked};
  updateSauceLikes(res, sauceId, update);
}

function dislikeSauce(res, sauceId, sauceObject, usersDisliked, userId){
  usersDisliked.push(userId);
  let update = {dislikes: sauceObject.dislikes + 1, usersDisliked: usersDisliked}
  updateSauceLikes(res, sauceId, update);
}

function unlikeSauce(res, sauceId, sauceObject, usersLiked, usersDisliked, userId){
  const didUserLiked = usersLiked.find(element => element == userId)
  const didUserDisliked = usersDisliked.find(element => element == userId)

  if (userId == didUserLiked){
    unlikeLikedSauce(res, sauceId, sauceObject, usersLiked, userId);
  } else if (userId == didUserDisliked){
    undislikeDislikedSauce(res, sauceId, sauceObject, usersLiked, userId);
  } else {
    throw({error})
  }
}

function unlikeLikedSauce(res, sauceId, sauceObject, usersLiked, userId) {
  usersLiked.splice(usersLiked.indexOf(userId))
  let update = {likes: sauceObject.likes - 1, usersLiked: usersLiked}
  updateSauceLikes(res, sauceId, update);
};

function undislikeDislikedSauce(res, sauceId, sauceObject, usersDisliked, userId){
  usersDisliked.splice(usersDisliked.indexOf(userId))
  let update = {dislikes: sauceObject.dislikes - 1, usersDisliked: usersDisliked}
  updateSauceLikes(res, sauceId, update);
}

function updateSauceLikes(res, sauceId, update){
  Sauce.findByIdAndUpdate(sauceId, update)
    .then(() => res.status(200).json())
    .catch(error => res.status(400).json({ error }));
}