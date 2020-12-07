/*Création des routes user du serveur*/

/*Importation des modules Express et du router*/
const express = require('express');
const router = express.Router();

/*Middleware du user*/
const userCtrl = require('../controllers/user');

/*Création d'un user*/
router.post('/signup', userCtrl.signup);
/*Identification d'un user*/
router.post('/login', userCtrl.login);

/*Exportation du router*/
module.exports = router;