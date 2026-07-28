// On importe le type Request et Response depuis Express, pour typer
// correctement les paramètres de chaque fonction de controller.
import type { Request, Response } from 'express';

// On importe le modèle Order qu'on a créé dans models/OrderModel.ts.
// C'est via ce modèle qu'on va pouvoir appeler .aggregate() sur la collection "orders".
import Order from '../models/OrderModel.js';

// ----------------------------------------------------------------------
// getTotalRevenue : calcule le revenu total de TOUTES les commandes,
// tous produits et tous clients confondus.
// ----------------------------------------------------------------------
export const getTotalRevenue = async (req: Request, res: Response) => {
  try {
    // On lance le pipeline d'agrégation sur la collection Order.
    const result = await Order.aggregate([
      {
        // $group avec _id: null veut dire : "ne fais aucun tri par catégorie,
        // regroupe TOUS les documents ensemble dans un seul groupe global".
        $group: {
          _id: null,
          // totalRevenue additionne, pour chaque commande, price * quantity,
          // puis fait la somme de tous ces sous-totaux avec $sum.
          totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      }
    ]);
    // Comme _id: null crée UN SEUL groupe, "result" est un tableau
    // avec un seul élément : on prend result[0] pour renvoyer un objet simple,
    // pas un tableau. On suit notre format habituel { status, data }.
    res.status(200).json({ status: 'success', data: result[0] });
  } catch (error) {
    // Si quelque chose se passe mal (erreur de connexion, etc.),
    // on renvoie une erreur 500 (erreur serveur) avec le message.
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

 export const getAveragePrice = async (req: Request, res: Response) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          averagePrice: { $avg: { $multiply: ['$price', '$quantity'] } }
        }
      }
    ]);

  // Comme _id: null crée UN SEUL groupe, on prend result[0]
    // pour renvoyer un objet simple plutôt qu'un tableau d'un élément.
    res.status(200).json({ status: 'success', data: result[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

// ----------------------------------------------------------------------
// getRevenueByProduct : calcule le revenu ET le nombre de commandes,
// regroupés par produit.
// ----------------------------------------------------------------------
export const getRevenueByProduct = async (req: Request, res: Response) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          // _id: "$product" veut dire : "crée un groupe différent pour
          // chaque valeur distincte du champ product" (Clavier, Souris, etc.)
          _id: '$product',
          revenue: { $sum: { $multiply: ['$price', '$quantity'] } },
          // $sum: 1 additionne "1" pour chaque document du groupe,
          // ce qui revient à compter combien de commandes il y a par produit.
          ordersCount: { $sum: 1 }
        }
      }
    ]);

    // Ici il y a PLUSIEURS groupes (un par produit), donc on renvoie
    // directement tout le tableau "result", pas result[0].
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};


export const getOrdersByCustomer = async (req: Request, res: Response) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
     
          _id: "$customerName",
        
     
          ordersCount: { $sum: 1 }
        }
      }
    ]);


    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};


export const getCustomerStats = async (req: Request, res: Response) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
  _id: "$customerName",
  totalOrders: { $sum: 1 },
  totalSpent: { $sum: { $multiply: ['$price', '$quantity'] } }
}
      }
    ]);


    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await Order.aggregate([
      {
        $match: { createdAt: { $gte: sevenDaysAgo } }
      }
    ]);

    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};


// ----------------------------------------------------------------------
// getTopProducts : comme getRevenueByProduct, mais en plus TRIÉ
// du produit le plus rentable au moins rentable.
// ----------------------------------------------------------------------
export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const result = await Order.aggregate([
      {
        // Étape 1 : on regroupe par produit et on calcule le revenu,
        // exactement comme dans getRevenueByProduct.
        $group: {
          _id: '$product',
          revenue: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      },
      {
        // Étape 2 : on trie le résultat de l'étape 1 par "revenue"
        // en ordre décroissant (-1 = du plus grand au plus petit).
        // Cette étape n'existe que parce que $group a déjà créé
        // le champ "revenue" juste avant — l'ordre des étapes compte !
        $sort: { revenue: -1 }
      }
    ]);

    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};