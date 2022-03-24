import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { getUtilisateurByCourriel } from 'controller/compteControllerjs';

const config = {
    usernameField: 'email',
    passwordField: 'password'
};

passport.use(new Strategy(config, async (email, password, done) => {
    try{
        const utilisateur = await getUtilisateurByCourriel(email);

        if(!utilisateur) {
            return done(null, false, { error: 'mauvais_utilisateur' });
        }
 
        const valide = await bcrypt.compare(password, utilisateur.password);

        if (!valide) {
            return done(null, false, { error: 'mauvais_mot_de_pass' });
        }

        return done(null, utilisateur);
    }
    catch (error) {
        return done(error);
    }
}));

passport.serializeUser((utilisateur, done) => {
    done(null, utilisateur.email);
});

passport.deserializeUser(async (email, done) => {
    try{
        let utilisateur = await getUtilisateurByCourriel(email);
        done(null, utilisateur);
    }
    catch(error)
    {
        done(error);
    }
});