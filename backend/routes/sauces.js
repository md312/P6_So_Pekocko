/*Création des routes sauces du serveur*/

/*Importation des modules Express et du router*/
const express = require('express');
const router = express.Router();

/*Importation des middlewares dans des variables*/
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/*Route likes*/
router.post('/:id/like', auth, saucesCtrl.likeSauce);
/*Route création de sauce*/
router.post('/', auth, multer, saucesCtrl.createSauce);
/*Route modification de sauce*/
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
/*Route suppression de sauce*/
router.delete('/:id', auth, saucesCtrl.deleteSauce);
/*Affichage d'une sauce*/
router.get('/:id', auth, saucesCtrl.getOneSauce);
/*Affichage de toutes les sauces*/
router.get('/', auth, saucesCtrl.getAllSauces);

/*Exportation du router*/
module.exports = router;