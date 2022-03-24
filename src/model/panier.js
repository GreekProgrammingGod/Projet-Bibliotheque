import connectionPromise from '../connection.js';

/**
 * Retourne une liste de tous les produits, leur quantite et leur total dans 
 * le panier dans la base de données.
 * @returns Une liste de tous les produits, leur quantite et leur total.
 */
export const getPanier = async () => {
    let connection = await connectionPromise;
    
    let results = await connection.all(
        `SELECT panier.id_livre, nom_livre, quantite
        FROM Panier INNER JOIN Livres ON panier.id_livre = Livres.id_livre;`
    );
    
    return results;
}

/**
 * Ajoute un produit dans le panier dans la base de données.
 * @param {Number} idLivre L'identifiant du produit à ajouter.
 * @param {Number} quantite La quantité du produit à ajouter.
 */
export const addToPanier = async (idLivre, quantite) => {
    let connection = await connectionPromise;
    
    // On recherche si le produit en paramètre existe déjà dans notre panier
    let entreePanier = await connection.get(
        'SELECT quantite FROM panier WHERE id_livre = ?;',
        [idLivre]
    );

    if (entreePanier) {
        // Si le produit existe déjà dans le panier, on incrémente sa quantité
        await connection.run(
            `UPDATE panier SET quantite = ?
            WHERE id_livre = ?;`,
            [quantite + entreePanier.quantite, idL]
        );
    }
    else {
        // Si le produit n'existe pas dans le panier, on l'insère dedans
        let result = await connection.run(
            `INSERT INTO panier(id_utilisateur, id_livre, quantite)
            VALUES(1, ?, ?);`,
            [idLivre, quantite]
        );
    }
}

/**
 * Retire un produit du panier dans la base de données.
 * @param {Number} idLivre L'identifiant du produit à retirer.
 */
export const removeFromPanier = async (idLivre) => {
    let connection = await connectionPromise;

    await connection.run(
        'DELETE FROM panier WHERE id_livre = ?;',
        [idLivre]
    );
}

/**
 * Vide le panier dans la base de données
 */
export const emptyPanier = async () => {
    let connection = await connectionPromise;

    await connection.run(
        'DELETE FROM panier;'
    );
}