/*Module de cryptage du mot de passe*/
const bcrypt = require('bcrypt');
/*Module de création de token utilisateur*/
const jwt = require('jsonwebtoken');

/*Importation du modèle User*/
const User = require('../models/User');

/*Création d'un utilisateur*/
exports.signup = (req, res, next) => {
    /*Cryptage du mot de passe*/
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            /*Création d'un nouvel utilisateur dans la base de donnée*/
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

/*Connexion d'un utilisateur*/
exports.login = (req, res, next) => {
    /*Recherche de l'utilisateur dans la base de donnée*/
    User.findOne({ email: req.body.email })
        .then(user => {
            /*Si on ne trouve pas l'utilisateur*/
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé !" });
            }
            /*Sinon on compare le hash du mot de passe*/
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    /*Si le mot de passe ne correspond pas*/
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !" });
                    }
                    /*S'il correspond on envoie un token utilisateur pour une durée de 15mn*/
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            '8uVGAuQuD7b2zmWzi0kgTJOSEHfZrIitUMDdjBUr1n_ZBHwV8CU_sgE8UrsBUVvzw8jWPe9p3kVDtekcUemA9WhmPlmR4HTMOKFCP-4bTeX4Un1cPET9kLLzIMUdieZV6lqKx8oxKflcp0UT86hK3T2IPqpAdA8',
                            { expiresIn: 15 * 60 }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
}; 