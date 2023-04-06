// Pour IMPORTER 'tout ce qui concerne 'MySQL' (BdD)' (réuni dans le fichier 'dataBase.js')
const db = require("../models/dataBase");

// Pour IMPORTER 'fs' ('fs' : 'file system' = 'système de fichiers' - c'est un des packages de 'NodeJS' - il permet de supprimer un fichier du système de fichiers)
const fs = require("fs");

// Pour CREER un 'like'
exports.createLike = (req, res, next) => {
  const userId = req.auth.userId; // 'userId' dans le HEADER de la requête (du 'front-end') (vient du token)
  const likeValue = req.body.valeur; // 'valeur' dans le BODY de la requête (du 'front-end') = '1' ou '0' ou '-1'
  const postId = req.params.id; // 'id' dans l'URL' de la requête (du 'front-end') (identique à celui de la route de 'post')

  db.like
    .create({
      userId: userId,
      postId: postId,
      valeur: likeValue,
    })
    .then(() => res.status(200).json({ message: "Like enregistré !" }))
    .catch((error) => res.status(400).json({ err: error }));
};

// Pour RECUPERER tous les 'likes'
exports.findAllLikes = (req, res, next) => {
  // Pour TROUVER / RECUPERER la liste complète des 'likes' dans 'MySQL' (BdD)
  db.like
    .findAll()
    .then((resultFindAll) => res.status(200).json(resultFindAll)) // Retour d'une promesse (=> 'resultFindAll' : renvoie d'un tableau contenant tous les 'posts' présents dans MySQL (BdD))
    .catch((error) => res.status(400).json({ error })); // Erreur
};

// Pour récupérer un 'like'
exports.findOneLike = (req, res, next) => {
  db.like
    .findByPk(
      // Pour RECUPERER un 'like' (recherché par la clé primaire, au lieu de 'where' + '{id}')
      req.params.id
    )
    .then((resultFindOne) => res.status(200).json(resultFindOne)) // Retour d'une promesse (=> 'resultFindOne' : renvoie 'Post' dans 'Posts' présent dans MySQL (BdD))
    .catch((error) => res.status(404).json({ error })); // Erreur (objet non trouvé)
};

// Pour SUPPRIMER un 'like'
exports.deleteOneLike = (req, res, next) => {
  db.like
    .findByPk(req.params.id) // 'findByPk' : recherche par la 'Primary Key' (souvent l'id) - 'id' (présent dans l'URL) de 'like' dans 'MySQL' (BdD)
    .then((like) => {
      // 'post' (= data (données) du résultat de la requête du front-end (réponse contenue dans la promesse)) : récupéré (en 'entier') par son 'id' dans 'MySQL' (BdD)
      // Pour VERIFIER les droits d'authentification de l'utilisateur (mesure de sécurité)
      if (like.userId != req.auth.userId) {
        // 'userId' (BdD) comparé à 'userId' (token)
        return res.status(401).json({ message: "Non-autorisé !" }); // (pas besoin de 'else' car 'return' stop le procès)
      }
      // Pour SUPPRIMER l'objet dans 'MySQL' (BdD)
      db.like
        .destroy({ where: { id: req.params.id } }) // = Objet qui sert de filtre (sélecteur) pour DESIGNER celui que l'on souhaite SUPPRIMER : {'id' envoyé dans les paramètres de la requête}
        .then(() => res.status(200).json({ message: "Like supprimé !" })) // Retour de la promesse
        .catch((error) => res.status(401).json({ error })); // Erreur
    })
    .catch((error) => res.status(500).json({ error }));
};
