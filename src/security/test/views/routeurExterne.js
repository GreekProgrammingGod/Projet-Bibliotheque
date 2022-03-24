import { Router } from 'express';
import path from 'path';
import sequelize from './../database/connexion-config.js';
import Compte from './../model/compte.js';
import passport from 'passport';
import Emprunt from './../model/emprunt.js';
import Livre from './../model/livre.js';
//import app from '../server.js';
const __dirname = path.resolve()
const router = Router();
;

sequelize.sync().
then(() => console.log("Base de donnees chargee"));

//Envoyer une requete GET que 'index' soit la page par defaut
router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, './views/index.html'));
});

//Envoyer une requete GET pour naviguer a la page 'index'
router.get('/index', (request, response) => {
    response.sendFile(path.join(__dirname, './views/index.html'));
});

//Envoyer une requete GET pour naviguer a la page 'comptes'
router.get('/comptes', (request, response) => {
    response.sendFile(path.join(__dirname, './views/comptes.html'));
});

//Envoyer une requete GET pour avoir tous les comptes dans la bd
router.get('/comptes', async (request, response) => {
    const users = await users.findAll();
    response.send(users);
});

//Requete POST pour enregister un nouveau compte
router.post('/comptes', async (request, response) => {
    await Compte.create(request.body).JSON;
    response.send('le compte a ete sauvegarde');
});

router.put('/comptes/:id', (request, response) => {
    console.log("comptes");
});

router.delete('/comptes/:id', (request, response) => {
    console.log("comptes");
});

//Envoyer une requete GET pour naviguer a la page 'livres'
router.get('/livres', (request, response) => {
    response.sendFile(path.join(__dirname, './views/livres.html'));
});

router.post('/livres', (request, response) => {
    console.log("livres");
});

router.put('/livres/:id', (request, response) => {
    console.log("livres");
});

router.delete('/livres/:id', (request, response) => {
    console.log("livres");
});

//Envoyer une requete GET pour naviguer a la page 'emprunts'
router.get('/emprunts', (request, response) => {
    response.sendFile(path.join(__dirname, './views/emprunts.html'));
});

router.post('/emprunts', (request, response) => {
    console.log("emprunts");
});

router.put('/emprunts/:id', (request, response) => {
    console.log("emprunts");
});

router.delete('/emprunts/:id', (request, response) => {
    console.log("emprunts");
});

router.get('/login', (request, response) => {
    response.sendFile(path.join(__dirname, './views/login.html'));
});

router.get('/contact', (request, response) => {
    response.sendFile(path.join(__dirname, './views/contact.html'));
});


export default router;
