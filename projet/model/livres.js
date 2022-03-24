import connectionPromise from '../connection.js';

/**
 * Retourne une liste de tous les livres dans la base de données.
 * @returns Une liste de tous les livres.
 */
export const getLivre = async () => {
    let connection = await connectionPromise;
    
    let results = await connection.all(
        'SELECT id_livre, nom_livre, id_type_livre FROM Livres;'
    );
    
    return results;
}