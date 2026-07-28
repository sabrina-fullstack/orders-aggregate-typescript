// On importe le module principal de Mongoose (la bibliothèque qui parle à MongoDB),
// ainsi que deux éléments qu'on n'utilise pas directement ici (Schema, model)
// mais qui restent disponibles si besoin plus tard.
import mongoose, { Schema, model } from 'mongoose';

// On définit la "forme" que doit avoir un document Order dans la base.
// Chaque clé (customerName, product...) correspond à un champ du document.
const orderSchema = new mongoose.Schema({

  // customerName doit être une chaîne de caractères, et il est obligatoire.
  // Si on essaie de créer une commande sans ce champ, Mongoose refusera (erreur de validation).
  customerName: { type: String, required: true },

  // Même logique pour le nom du produit commandé.
  product: { type: String, required: true },

  // quantity doit être un nombre, obligatoire — combien d'unités du produit ont été commandées.
  quantity: { type: Number, required: true },

  // price doit être un nombre, obligatoire — le prix unitaire du produit
  // (c'est important : c'est le prix PAR unité, pas le total de la commande,
  // c'est pour ça qu'on multiplie price * quantity dans les agrégations).
  price: { type: Number, required: true },

  // createdAt est une date. On ne la marque PAS "required" car on lui donne
  // une valeur par défaut : Date.now (la date/heure actuelle au moment de la création).
  // Donc si on ne précise rien, Mongoose la remplit automatiquement tout seul.
  createdAt: { type: Date, default: Date.now }
});

// On exporte le modèle "Order" construit à partir de ce schéma.
// Mongoose va automatiquement créer/utiliser une collection nommée "orders"
// (il met le nom au pluriel et en minuscule tout seul) dans la base MongoDB.
export default model('Order', orderSchema);