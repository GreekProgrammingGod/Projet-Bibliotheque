// Aller chercher les configurations de l'application
import 'dotenv/config';

//Importer document de routes externe
import routerExterne from './routes/routeurExterne.js';
import path from 'path';
const __dirname = path.resolve();

// Importer les fichiers et librairies
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cspOption from './csp-options.js'

// Création du serveur
const app = express();

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(express.static(__dirname));


//Charger les routes du fichier externe "routes"
app.use(routerExterne);
// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
    // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
    response.status(404).send('<h1>404! Page not found</h1>');
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.info(`Serveurs démarré:`);
console.info(`http://localhost:${ process.env.PORT }`);


// Route page Login
app.get('./login', (request, response) => {
    response.render('login', {
        title: 'Login',
        user: request.user,
        admin: request?.user?.id_type_utilisateur > 9000
    });
});

// Route page d'inscription
app.get('./inscription', (request, response) => {
    response.render('inscription', {
        title: 'Inscription',
        user: request.user,
        admin: request?.user?.id_type_utilisateur > 9000
    });
});


// route d'authentification pour l'inscription
app.post('./comptes', async (request, response, next) => {
    // Valider courriel/password
    if(validatePassword(request.body.password) &&
        validateEmail(request.body.email)) {
        try{
            await addUtilisateur(request.body.email, request.body.password);
            response.sendStatus(201);
        }
        catch(error) {
            if(error.code === 'SQLITE_CONSTRAINT') {
                response.sendStatus(409);
            }
            else {
                next(error);
            }
        }
    }
    else {
        response.sendStatus(400);
    }
});

// route d'authentification pour la connexion
app.post('./login', async (request, response, next) => {
    // Valider courriel/password
    if (validatePassword(request.body.password) &&
    validateEmail(request.body.email)) {
        passport.authenticate('local', (error, utilisateur, info) => {
            if (error) {
                next(error);
            }
            else if (!utilisateur) {
                response.status(401).json(info);
            }
            else {
                request.logIn(utilisateur, (error) => {
                    if (error) {
                        next(error);
                    }

                    response.sendStatus(200);
                });
            }
        })(request, response, next);
    }
    else {
        response.sendStatus(400);
    }
});

// route d'authentification pour la déconnexion
app.post('./deconnexion', async (request, response) => {
    request.logout();
    response.redirect('/');
});



//export default app;