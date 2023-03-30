// Pour IMPORTER 'express' (Application 'Express')
const express = require("express");

// Pour CREER un 'router Express' (Middleware 'routeur')
const router = express.Router();

// Pour IMPORTER 'auth' (Middleware 'authentification')
const auth = require("../middleware/auth");

// Pour IMPORTER 'multer' (Middleware 'enregistreur de fichiers')
const multer = require("../middleware/multer-config");

// Pour IMPORTER 'post' (Controller 'post' : permet la gestion de la route)
const postController = require("../controllers/post");

// Infos (générales) :
// - L'argument '/api/post' est le 'endpoint' visé par l'application ('endpoint' = URL / URI (route vers l'API) -> Il est remplacé par seulement un '/' car le router remplace le début du path)
// - REMPLACER 'use' par 'un verbe HTTP' (pour CIBLER les différents types de requêtes)

// POSTS :

// Route 'GET' : Pour TROUVER / RECUPERER la liste complète des 'posts' dans 'MySQL' (BdD)
// Fonction ('findAllPosts') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route
router.get("/", auth, postController.findAllPosts);

// Route 'GET' : Pour RECUPERER un 'post' individuel dans 'MySQL' (BdD)
// Fonction ('findOnePost') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route
router.get("/:id", auth, postController.findOnePost); // ':id' = 'id' du post (valeur variable)

// Route 'POST' : Pour ENREGISTRER un 'post' dans 'MySQL' (BdD)
// Fonction ('createPost') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route
router.post("/", auth, multer, postController.createPost);

// Route 'PUT' : Pour MODIFIER un 'post' dans 'MySQL' (BdD)
// Fonction ('update') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route
router.put("/:id", auth, multer, postController.updatePost); // ':id' = 'id' du post (valeur variable)

// Route 'DELETE' : Pour supprimer la liste complète des 'posts' dans 'MySQL' (BdD)
// Fonction ('deleteAllPosts') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route
router.delete("/", auth, postController.deleteAllPosts);

// Route 'DELETE' : Pour supprimer un 'post' dans 'MySQL' (BdD)
// Fonction ('deleteOnePost') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route
router.delete("/:id", auth, postController.deleteOnePost); // ':id' = 'id' du post (valeur variable)

// LIKES / DISLIKES :

// Route 'GET' : Pour RECUPERER tous les 'likes' (ou les 'dislikes') dans 'MySQL' (BdD)
// Fonction ('findAllLikes') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route
//router.get('/likes', auth, postController.findAllLikes);

// Route 'POST' : Pour CREER un 'like' (ou un 'dislike') dans 'MySQL' (BdD) (info : Méthode 'POST' utilisée car l'action que l'on souhaite réaliser est l'ajout d'un '1' dans 'like' (ou 'dislike') : '+1 like' (ou '+1 dislike'))
// Fonction ('createLike') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route
router.post("/:id/like", auth, postController.createLike); // ':id' = 'id' du post (valeur variable)

// Pour EXPORTER le routeur (qui va être importé dans 'app.js')
module.exports = router;
