/*Authentification de l'utilisateur pour sa session*/

/*Importation du module Json Web Token*/
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        /*Récupération du token dans le header*/
        next();
        const token = req.headers.authorization.split(' ')[1];
        /*Vérification du token*/
        const decodedToken = jwt.verify(token, '8uVGAuQuD7b2zmWzi0kgTJOSEHfZrIitUMDdjBUr1n_ZBHwV8CU_sgE8UrsBUVvzw8jWPe9p3kVDtekcUemA9WhmPlmR4HTMOKFCP-4bTeX4Un1cPET9kLLzIMUdieZV6lqKx8oxKflcp0UT86hK3T2IPqpAdA8');
        const userId = decodedToken.userId;
        /*Vérification de l'identifiant du user*/
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        }
    } catch (error) {
        res.status(401).json({ error: error || 'Requête non authentifiée !' });
    }
};