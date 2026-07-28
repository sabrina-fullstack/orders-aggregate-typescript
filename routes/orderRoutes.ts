// On importe Router depuis Express : c'est un "mini routeur" qu'on peut
// construire séparément, puis brancher dans app.ts. Ça permet de garder
// app.ts propre, sans y entasser toutes les routes directement.
import { Router } from 'express';

// On importe TOUTES les fonctions exportées du controller d'un coup,
// regroupées sous un seul objet nommé "orderController".
// Le "* as" veut dire "importe tout ce qu'il y a dans ce fichier".
// Le .js à la fin est obligatoire (règle ESModule), même si le vrai fichier est .ts.
import * as orderController from '../controllers/orderController.js';

// On crée une instance de routeur Express.
// À partir de maintenant, "router" se comporte comme un mini "app"
// mais uniquement pour les routes qu'on va lui attacher.
const router = Router();

// Chaque ligne définit : une méthode HTTP (get), une URL, et la fonction
// du controller qui doit s'exécuter quand cette URL est appelée.
// Rappel : ces URLs seront préfixées par "/api/orders" (défini dans app.ts),
// donc l'URL réelle sera par exemple "/api/orders/stats/total-revenue".

// Route pour obtenir le revenu total de toutes les commandes.
router.get('/stats/total-revenue', orderController.getTotalRevenue);

// Route pour obtenir le revenu regroupé par produit.
router.get('/stats/by-product', orderController.getRevenueByProduct);

// Route pour obtenir les produits triés du plus rentable au moins rentable.
router.get('/stats/top-products', orderController.getTopProducts);

router.get('/stats/average-price', orderController.getAveragePrice);
router.get('/stats/by-customer', orderController.getOrdersByCustomer);
router.get('/stats/customer-stats', orderController.getCustomerStats);
router.get('/stats/recent-orders', orderController.getRecentOrders);

// On exporte ce routeur comme export par défaut, pour que app.ts
// puisse l'importer avec "import orderRoutes from './routes/orderRoutes.js'".
export default router;