// Aller chercher les configurations de l'application
import 'dotenv/config';

// Importer les fichiers et librairies
import express, { json, request, response, urlencoded } from 'express';
//Importer document de routes externe
import path from 'path';
const __dirname = path.resolve();
//import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cspOption from './csp-options.js'
import https from 'https';
import { readFile } from 'fs/promises';
import expressHandlebars from 'express-handlebars';
import session from 'express-session';
// import memorystore from 'memorystore';
import passport from 'passport';
import { getLivre } from './model/livres.js';
import { getPanier, addToPanier, removeFromPanier, emptyPanier } from './model/panier.js';
import { getCommande, addCommande, modifyEtatCommande, getEtatCommande } from './model/commande.js';
import { validateId, validatePanier, validateEmail, validatePassword } from './validation.js';
import './authentification.js';
import { addUtilisateur } from './model/utilisateur.js';
import middlewareSse from './middleware-sse.js';
import redirectToHTTPS from './redirect-to-https.js';

// Création du serveur
const app = express();

app.engine('handlebars', expressHandlebars({
    helpers: {
        equals: (valeur1, valeur2) => valeur1 === valeur2
    }
}));

app.set('view engine', 'handlebars');

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(redirectToHTTPS);
app.use(compression());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({
    cookie: { maxAge: 3600000 },
    name: process.env.npm_package_name,
    //store: new MemoryStore({ checkPeriod: 3600000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(middlewareSse());

// Routes

// Route page Login
app.get('/login', (request, response) => {
    response.render('login', {
        title: 'Login',
        user: request.user,
        admin: request?.user?.id_type_utilisateur > 9000
    });
});

// Route page d'inscription
app.get('/inscription', (request, response) => {
    response.render('inscription', {
        title: 'Inscription',
        user: request.user,
        admin: request?.user?.id_type_utilisateur > 9000
    });
});

// Route page user
app.get('/user', (request, response) => {
    if(request.user){
        response.render('user', {
            title: 'Utilisateur',
            user: request.user,
            admin: request?.user?.id_type_utilisateur > 9000
        });
    }
    else {
        response.sendStatus(401);
    }
});

// Route page Administrateur
app.get('/admin', (request, response) => {
    if(request.user){
        response.sendStatus(401);
    }
    else if(request.user.id_type_utilisateur <= 9000) {
        response.sendStatus(403);
    }
    else {
        response.render('admin', {
            title: 'Admin', 
            user: request.user,
            admin: request?.user?.id_type_utilisateur > 9000
        });
    }
});

// route d'authentification pour l'inscription
app.post('/inscription', async (request, response, next) => {
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
app.post('/login', async (request, response, next) => {
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
app.post('/deconnexion', async (request, response) => {
    request.logout();
    response.redirect('/accueil');
});

// Route de la page d'acceuil
app.get('/accueil', async (request, response) => {
    response.render('accueil', {
        title: 'Accueil',
        livre: await getLivre(),
        user: request.user,
        admin: request?.user?.id_type_utilisateur > 9000
    });
});

// Route de la page du panier
app.get('/panier', async (request, response) => {
    let panier = await getPanier()
    response.render('panier', {
        title: 'Panier',
        livre: panier,
        estVide: panier.length <= 0,
        user: request.user,
        admin: request?.user?.id_type_utilisateur > 9000
    });
});

// Route pour ajouter un élément au panier
app.post('/panier', async (request, response) => {
    if (validateId(request.body.idLivre)) {
        addToPanier(request.body.idLivre, 1);
        response.sendStatus(201);
    }
    else {
        response.sendStatus(400);
    }
});

// Route pour supprimer un élément du panier
app.patch('/panier', async (request, response) => {
    if (validateId(request.body.idLivre)) {
        removeFromPanier(request.body.idLivre);
        response.sendStatus(200);
    }
    else {
        response.sendStatus(400);
    }
});

// Route pour vider le panier
app.delete('/panier', async (request, response) => {
    if (await validatePanier()) {
        emptyPanier();
        response.sendStatus(200);
    }
    else {
        response.sendStatus(400);
    }
});

// Route de la page des commandes
app.get('/commande', async (request, response) => {
    response.render('commande', {
        title: 'Commandes',
        commande: await getCommande(),
        etatCommande: await getEtatCommande(),
        user: request.user,
        admin: request?.user?.id_type_utilisateur > 9000
    });
});

// Initialiser le stream de données
app.get('/commande', (request, response) => {
    response.initStream();
});

// Route pour soumettre le panier
app.post('/commande', async (request, response) => {
    if (await validatePanier()) {
        addCommande();
        response.sendStatus(201);
    }
    else {
        response.sendStatus(400);
    }
});

// Route pour modifier l'état d'une commande
app.patch('/commande', async (request, response) => {
    if (await validateId(request.body.idCommande) &&
        await validateId(request.body.idEtatCommande)) {
        modifyEtatCommande(
            request.body.idCommande,
            request.body.idEtatCommande
        );
        response.sendStatus(200);

// Modifier en temps réel les commandes
        let data = {
            modify1: modifyEtatCommande().request.body.idCommande,
            modify2: modifyEtatCommande().request.body.idEtatCommande,
        }
        response.pushJson(data);

    }
    else {
        response.sendStatus(400);
    }
});

app.route('/livres') 
    //Requete GET pour rediriger vers la page html 'livres'
    .get((req, res) => {
        res.render("livres", {layout: 'main'});
    })
    //Requete POST pour enregister un nouveau livre
    .post( async (req, res) => {
        await Livre.create(req.body);
        res.send('le livre a ete sauvegarde');
    })
// // Exécuter uniquement lorsqu'un utilisateur est connecter au serveur
// app.get('/route-connecte', (request, response) =>{
//     if(!request.user){
//         response.sendStatus(401);
//     }
//     else {
//         response.status(200).json(request.user);
//     }
// });

// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
    // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
    response.status(404).send(request.originalUrl + ' not found.');
});

// Démarrage du serveur
//app.listen(process.env.PORT);
console.info(`Serveurs démarré:`);
if(process.env.NODE_ENV === 'production') {
    app.listen(process.env.PORT);
    console.info(`http://localhost:${ process.env.PORT }/accueil`);
}
else {
    const credentials = {
        key: await readFile('./security/localhost.key'),
        cert: await readFile('./security/localhost.cert')
    };

    https.createServer(credentials, app).listen(process.env.PORT);
    console.info(`https://localhost:${ process.env.PORT }/accueil`);
}


// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
    // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
    response.status(404).send(request.originalUrl + ' not found.');
});

// // Démarrage du serveur
// app.listen(process.env.PORT);
// console.info(`Serveurs démarré:`);
// console.info(`http://localhost:${ process.env.PORT }`);


// let db = new sqlite3.Database('/bibliotheque.db', (err) => {
//     if (err) {
//         console.log(err.message);
//     }
//     console.log('Connexion à la base de données');
// });

// app.get('/createdb', (req, res) => {
//     let sql = 'bibliotheque.bd'
//     db.query(sql, err => {
//         if(err) {
//             throw err;
//         }
//         res.send('Database created)');
//     });
// });
// //let query = db.exec(sql)
// db.close();
