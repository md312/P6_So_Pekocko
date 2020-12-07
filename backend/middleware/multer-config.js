/*Middleware de Multer pour les images*/
const multer = require('multer');

/*Récupération des types d'images reçus par Multer*/
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

/*Configuration du fichier image à stocker*/
const storage = multer.diskStorage({
    /*Fichier de destination*/
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    /*Nom modifié de l'image*/
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

/*Exportation de Multer*/
module.exports = multer({ storage: storage }).single('image');