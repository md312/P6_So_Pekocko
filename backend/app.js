/*Importation des modules pour l'application*/
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

/*Importation des routes sauces et user*/
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const { dirname } = require('path');

/*Connection à la base de données Mongo Db*/
mongoose.connect('mongodb+srv://mdub:3P0OdTW22HBGsBiI@sopekocko.eiduo.mongodb.net/SoPekocko?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

/*Headers des requêtes de l'API*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/*Utilisation du body parser pour les requêtes*/
app.use(bodyParser.json());

/*Utilisation du dossier images pour les images des sauces*/
app.use('/images', express.static(path.join(__dirname, 'images')));

/*Utilisation des routes sauces et user sur les adresses requises*/
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;