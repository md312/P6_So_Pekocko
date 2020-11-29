const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
      sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {    
        ...req.body.sauce,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) 
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));

};

exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;

  if (like == 1) {
    Sauce.updateOne({ _id: sauceId },
      { likes: +1, usersLiked: userId }
    )
      .then(() => res.status(200).json({ message: "L'utilisateur a mis un like ! " }))
      .catch(error => res.status(400).json({ error }));
  }

  else if (like == -1) {
    Sauce.updateOne({ _id: sauceId },
      { dislikes: +1, usersDisliked: userId }
    )
      .then(() => res.status(200).json({ message: "L'utilisateur a mis un dislike ! " }))
      .catch(error => res.status(400).json({ error }));

  } else {

    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersDisliked.find(userId => userId === req.body.userId)) {
          Sauce.updateOne({ _id: sauceId },
            { likes: -1 },
            { $pull: { usersLiked: userId } }
          )
            .then(() => res.status(200).json({ message: "L'utilisateur a retiré son like !" }))
            .catch((error) => res.status(404).json({ error: error }));

        } else {
          Sauce.updateOne({ _id: sauceId },
            { dislikes: -1 },
            { $pull: { usersDisliked: userId } }
          )
            .then(() => res.status(200).json({ message: "L'utilisateur retiré son dislike ! " }))
            .catch(error => res.status(400).json({ error }));
        }
      })
      .catch(error => res.status(400).json({ error }));
  }
}