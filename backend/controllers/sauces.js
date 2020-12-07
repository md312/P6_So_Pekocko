/*Modèle d'une sauce*/
const Sauce = require('../models/Sauce');
/*Import du module fs*/
const fs = require('fs');

/*Middleware création de sauce*/
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    /*Mise des likes et dislikes à 0*/
    sauceObject.likes = 0;
    sauceObject.dislikes = 0;
    /*On enlève l'id de la sauce car l'id sera ajouté par MongoDb*/
    delete sauceObject._id;
    /*Création d'une nouvelle entrée dans la base de donnée avec importation de l'image*/
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
      sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

/*Middleware modification de sauce*/
exports.modifySauce = (req, res, next) => {
  /*Recherche d'un fichier image dans la requête*/
    const sauceObject = req.file ?
    {    /*Récupération du corps de la requête et transformation de l'url image en nom de fichier*/
        ...req.body.sauce,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    /*Mise à jour de la sauce*/
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

/*Middleware suppression de sauce*/
exports.deleteSauce = (req, res, next) => {
  /*Recherche de la sauce suivant l'id des paramètres de requête*/
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        /*Recherche et suppression de l'image*/
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          /*Suppression de la sauce*/
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

/*Middleware affichage d'une sauce*/  
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) 
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

/*Middleware affichage de toutes les sauces*/
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));

};

/*Middleware des likes et dislikes*/
exports.likeSauce = (req, res, next) => {
  /*Création des constantes nécessaires*/
  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;

/*Recherche de la sauce appropriée*/
  Sauce.findOne({ _id: sauceId })
    .then(sauce => {
      /*Création des variables pour récupérer les champs de la base de donnée appropriés*/
      let usersLiked = sauce.usersLiked;
      let likes = sauce.likes;
      let usersDisliked = sauce.usersDisliked;
      let dislikes = sauce.dislikes;
      
      /*Si l'utilisateur like la sauce*/
      if (like == 1) {
        /*Si l'id de l'utilisateur n'est pas déjà compris dans le tableau des usersLiked*/
        if (!usersLiked.includes(userId)) {
          /*On ajoute l'id de l'utilisateur dans le tableau*/
          usersLiked.push(userId);
          /*On ajoute un like*/
          likes++;
        }
        /*Si l'utilisateur dislike la sauce*/
      } else if (like == -1) {
        /*Si l'id de l'utilisateur n'est pas déjà compris dans le tableau des usersDisliked*/
        if (!usersDisliked.includes(userId)) {
          /*On ajoute l'id de l'utilisateur dans le tableau*/
          usersDisliked.push(userId);
          /*On ajoute un dislike*/
          dislikes = dislikes + 1;
        }
      } else {
        /*Si l'utilisateur enlève son like*/
        if (usersLiked.includes(userId)) {
          /*On va chercher l'id utilisateur dans le tableau des usersLiked*/
          var index = usersLiked.indexOf(userId);
          /*On enlève l'id utilisateur du tableau*/
          usersLiked.splice(index, 1);
          /*On retire un like*/
          likes = likes - 1;
        }
         /*Si l'utilisateur enlève son dislike*/
        if (usersDisliked.includes(userId)) {
          /*On va chercher l'id utilisateur dans le tableau des usersDisliked*/
          var index = usersDisliked.indexOf(userId);
          /*On enlève l'id utilisateur du tableau*/
          usersDisliked.splice(index, 1);
          /*On retire un dislike*/
          dislikes = dislikes - 1;
        }
      }
      /*On met à jour tous les champs nécessaires dans la sauce*/
      Sauce.updateOne({ _id: sauceId },
        { dislikes: dislikes, usersDisliked: usersDisliked, likes: likes, usersLiked: usersLiked }
      )
        .then(() => res.status(200).json({ message: "L'utilisateur a mis un like ! " }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));

}