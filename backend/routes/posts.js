// Pour IMPORTER 'express' (Application 'Express')
const express = require('express');

// Pour CREER un 'router Express' (Middleware 'routeur')
const router = express.Router();

// Pour IMPORTER 'auth' (Middleware 'authentification')
const auth = require('../middleware/auth');

// Pour IMPORTER 'multer' (Middleware 'enregistreur de fichiers')
const multer = require('../middleware/multer-config');

// Pour IMPORTER 'posts' (Controller 'posts' : permet la gestion de la route) 
const postsController = require('../controllers/posts');

// Infos (générales) :
// - L'argument '/api/posts' est le 'endpoint' visé par l'application ('endpoint' = URL / URI (route vers l'API) -> Il est remplacé par seulement un '/' car le router remplace le début du path)
// - REMPLACER 'use' par 'un verbe HTTP' (pour CIBLER les différents types de requêtes)

// POSTS :

// Route 'GET' : Pour TROUVER / RECUPERER la liste complète des 'posts' dans 'MySQL' (BdD)
// Fonction ('findAll') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route 
router.get('/', auth, postsController.findAll);

// Route 'GET' : Pour RECUPERER un 'post' individuelle dans 'MySQL' (BdD)
// Fonction ('findOne') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route 
router.get('/:id', auth, postsController.findOne); // (':id' : valeur variable)

// Route 'POST' : Pour ENREGISTRER un 'post' dans 'MySQL' (BdD)
// Fonction ('createPost') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route 
router.post('/', auth, multer, postsController.create);

// Route 'PUT' : Pour MODIFIER un 'post' dans 'MySQL' (BdD)
// Fonction ('update') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route 
router.put('/:id', auth, multer, postsController.update); // (':id' : valeur variable)

// Route 'DELETE' : Pour supprimer un 'post' dans 'MySQL' (BdD)
// Fonction ('delete') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route 
router.delete('/:id', auth, postsController.deleteOne); // (':id' : valeur variable)

// deleteAll

// LIKES / DISLIKES :

// Route 'POST' : Pour ENREGISTRER un 'like' (ou un 'dislike') dans 'MySQL' (BdD) (info : Méthode 'POST' utilisée car l'action que l'on souhaite réaliser est l'ajout d'un '1' dans 'like' (ou 'dislike') : '+1 like' (ou '+1 dislike'))
// Fonction ('likePost') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route 
router.post('/:id/like', auth, postsController.likePost); // (':id' : valeur variable)


// Pour EXPORTER le routeur (qui va être importé dans 'app.js')
module.exports = router;