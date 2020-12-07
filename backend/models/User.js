/*Création du modèle d'un User*/
const mongoose = require("mongoose");

/*Importation du validateur Mongoose pour vérifier que le User soit unique*/
const uniqueValidator = require("mongoose-unique-validator");

/*Création du schéma User*/
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
userSchema.plugin(uniqueValidator);

/*Exportation du module*/
module.exports = mongoose.model('User', userSchema);