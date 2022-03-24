import connectionPromise from "../connection.js";
import bcrypt from 'bcrypt';

export const addUtilisateur = async (email, password) => {
    let connection = await connectionPromise;

    let motDePasseEncrypte = await bcrypt.hash(password, 10);

    await connection.run(
        `INSERT INTO utilisateur(id_type_utilisateur, email, password)
        VALUES (1, ?, ?);`,
        [email, motDePasseEncrypte]
    );
};

export const getUtilisateurByCourriel = async (email) => {
    let connection = await connectionPromise;

    let utilisateur = await connection.get(
        `SELECT * FROM utilisateur WHERE email = ?`,
        [email]
    );

    return utilisateur;
}