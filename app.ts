// Le framework qui gère le serveur HTTP et les routes.
import express from 'express';

// La bibliothèque qui nous permet de nous connecter à MongoDB et de définir des modèles.
import mongoose from 'mongoose';

// dotenv permet de lire les variables du fichier .env (comme MONGO_URI, PORT)
// et de les rendre accessibles via process.env.
import dotenv from 'dotenv';

// On importe le "routeur" qu'on va écrire dans routes/orderRoutes.ts.
// Note le .js à la fin même si le vrai fichier est .ts — c'est une règle
// des ES Modules en Node.js : les imports doivent pointer vers l'extension finale compilée.
import orderRoutes from './routes/orderRoutes.js';

// Cette ligne DOIT être appelée avant d'utiliser process.env.MONGO_URI plus bas.
// Elle lit le fichier .env et charge son contenu dans process.env.
dotenv.config();

// On crée l'application Express — c'est l'objet central qui va gérer
// toutes les requêtes HTTP entrantes.
const app = express();

// Ce middleware permet à Express de comprendre le JSON envoyé dans le body
// des requêtes (par exemple si on faisait un POST avec des données JSON).
// Ici on n'en a pas forcément besoin pour de l'agrégation (lecture seule),
// mais on le garde par habitude/cohérence avec les projets précédents.
app.use(express.json());

// Toute route définie dans orderRoutes sera automatiquement préfixée
// par "/api/orders". Par exemple, une route "/stats/total-revenue"
// dans orderRoutes.ts deviendra accessible à "/api/orders/stats/total-revenue".
app.use('/api/orders', orderRoutes);

// On récupère le port depuis .env, ou 3000 par défaut si la variable n'existe pas.
const PORT = process.env.PORT || 3000;

// On récupère l'URI de connexion MongoDB depuis .env.
// "as string" dit à TypeScript "fais-moi confiance, cette valeur ne sera pas undefined"
// (TypeScript ne peut pas savoir à l'avance que la variable existe vraiment dans .env).
const MONGO_URI = process.env.MONGO_URI as string;

// On tente de se connecter à MongoDB.
mongoose.connect(MONGO_URI)
  .then(() => {
    // Ce bloc ne s'exécute QUE si la connexion a réussi.
    console.log('Connecté à MongoDB');

    // On ne démarre le serveur Express qu'une fois la connexion établie —
    // ça évite de recevoir des requêtes alors que la base n'est pas encore prête.
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    // Ce bloc s'exécute si la connexion échoue (mauvais mot de passe,
    // IP non whitelistée sur Atlas, problème réseau, etc.)
    console.error('Erreur de connexion à MongoDB :', error);
  });