// Pour IMPORTER 'express' (Application 'Express')
const express = require("express");

// Pour CREER un 'router Express' (Middleware 'routeur')
const router = express.Router();

// Pour IMPORTER 'auth' (Middleware 'authentification')
const auth = require("../middleware/auth");

// Pour IMPORTER 'like' (Controller 'like' : permet la gestion de la route)
const likeController = require("../controllers/like");

// Infos (générales) :
// - L'argument '/api/like' est le 'endpoint' visé par l'application ('endpoint' = URL / URI (route vers l'API) -> Il est remplacé par seulement un '/' car le router remplace le début du path)
// - REMPLACER 'use' par 'un verbe HTTP' (pour CIBLER les différents types de requêtes)

//Route 'GET' : Pour RECUPERER tous les 'likes' dans 'MySQL' (BdD)
//Fonction ('findAllLike') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route
router.get("/", auth, likeController.findAllLikes);

//Route 'GET' : Pour RECUPERER un 'like' dans 'MySQL' (BdD)
//Fonction ('findOneLike') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route
router.get("/:id", auth, likeController.findOneLike); // 'id' = id du 'like'

//Route 'POST' : Pour CREER un 'like' dans 'MySQL' (BdD) (info : Méthode 'POST' utilisée car l'action que l'on souhaite réaliser est l'ajout d'un '1' dans 'like' (ou 'dislike') : '+1 like' (ou '+1 dislike'))
//Fonction ('createLike') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route
router.post("/post/:id", auth, likeController.createLike);

// Route 'DELETE' : Pour supprimer un 'like' dans 'MySQL' (BdD)
// Fonction ('deleteOneLike') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route
router.delete("/:id", auth, likeController.deleteOneLike); // ':id' = 'id' du 'like' (valeur variable)

// Pour EXPORTER le routeur (qui va être importé dans 'app.js')
module.exports = router;
