# orders-aggregate-typescript

Projet réalisé dans le cadre de la Partie 11 du cours TypeScript + Node.js — Mongoose Aggregate (pipelines d'agrégation MongoDB).

## Concepts couverts
- Différence entre `find()` (CRUD) et `aggregate()` (données calculées)
- Pipeline d'agrégation : `$match`, `$group`, `$sort`
- Calculs avec `$sum`, `$avg`, `$multiply`
- Exposition des résultats via des routes REST

## Stack
- Node.js + TypeScript (ESModules, `tsx`)
- Express
- MongoDB Atlas + Mongoose

## Routes disponibles
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/orders/stats/total-revenue` | Revenu total |
| GET | `/api/orders/stats/by-product` | Revenu par produit |
| GET | `/api/orders/stats/top-products` | Produits triés par revenu |
| GET | `/api/orders/stats/average-price` | Prix moyen d'une commande |
| GET | `/api/orders/stats/by-customer` | Nombre de commandes par client |
| GET | `/api/orders/stats/customer-stats` | Statistiques complètes par client |
| GET | `/api/orders/stats/recent-orders` | Commandes des 7 derniers jours |

## Installation
\`\`\`bash
npm install
# créer un fichier .env avec MONGO_URI et PORT
npm run dev
\`\`\`
