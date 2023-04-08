// Pour IMPORTER 'tout ce qui concerne 'MySQL' (BdD)' (réuni dans le fichier 'dataBase.js')
const db = require("../models/dataBase");

// Pour IMPORTER 'fs' ('fs' : 'file system' = 'système de fichiers' - c'est un des packages de 'NodeJS' - il permet de supprimer un fichier du système de fichiers)
const fs = require("fs");

// Pour GERER la route 'GET' : On EXPORTE la fonction 'findAllPosts' pour la récupération de tous les objets ('post') présents dans MySQL (BdD)
exports.findAllPosts = (req, res, next) => {
  // Pour TROUVER / RECUPERER la liste complète des 'posts' dans 'MySQL' (BdD)
  db.post
    .findAll({
      // Permet de RECUPERER en même temps les users associés aux posts
      include: [
        {
          model: db.user,
        },
      ],
    })
    .then((resultFindAll) => res.status(200).json(resultFindAll)) // Retour d'une promesse (=> 'resultFindAll' : renvoie d'un tableau contenant tous les 'posts' présents dans MySQL (BdD))
    .catch((error) => res.status(400).json({ error })); // Erreur
};

// Pour GERER la route 'GET' : On EXPORTE la fonction 'findOnePost' pour la récupération d'un objet ('post'), particulier, présent dans MySQL (BdD)
exports.findOnePost = (req, res, next) => {
  db.post
    .findByPk(
      // Pour RECUPERER un 'post' (recherché par la clé primaire, au lieu de 'where' + '{id}')
      req.params.id,
      {
        // Permet de RECUPERER en même temps le 'user' et le 'like' associés au post
        include: [
          {
            model: db.user,
          },
          {
            model: db.like,
          },
        ],
      }
    )
    .then((resultFindOne) => res.status(200).json(resultFindOne)) // Retour d'une promesse (=> 'resultFindOne' : renvoie 'Post' dans 'Posts' présent dans MySQL (BdD))
    .catch((error) => res.status(404).json({ error })); // Erreur (objet non trouvé)
};

// Pour GERER la route 'POST' : On EXPORTE la fonction 'createPost' pour la création d'un objet ('post') dans 'MySQL' (BdD)
exports.createPost = (req, res, next) => {
  // Création d'une instance (= exemplaire) de la classe (= model) 'Post' (importée plus haut avec 'db')
  let post = {
    titre: req.body.titre,
    //auteur: req.body.auteur, // (c.f info dans 'model post')
    contenu: req.body.contenu,
    userId: req.auth.userId, // 'userId' = extrait de l'objet 'requête' grâce au middleware 'auth' - Ou 'res.locals.auth.userId' à la place de "req.auth.userId"
  };
  // Si présence d'une 'image' dans le 'post'
  if (req.file) {
    // Pour GENERER l'URL de l'image (par nous-même, car 'Multer' ne délivre que le nom du fichier, en utilisant des propriétés de l'objet 'requête' : protocole - nom d'hôte - nom du dossier - nom du fichier (délivré par 'Multer'))
    post.imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }
  // Pour ENREGISTRER un nouvel objet 'post' dans 'MySQL' (BdD)
  db.post
    .create(post)
    .then(() => res.status(200).json({ message: "Nouveau post créé !" })) // Retour de la promesse
    .catch((error) => res.status(400).json({ err: error }));
};

// Pour GERER la route 'PUT' : On EXPORTE la fonction 'updatePost' pour la modification d'un objet ('post') dans MySQL (BdD)
exports.updatePost = (req, res, next) => {
  db.post
    .findByPk(req.params.id) // 'findByPk' : recherche par la 'Primary Key' (souvent l'id) - 'id' (présent dans l'URL) de 'post' dans 'MySQL' (BdD)
    .then((post) => {
      // 'post' (= data) du résultat de la requête du front-end (réponse contenue dans la promesse)) : récupéré (en 'entier') par son 'id' dans 'MySQL' (BdD)
      // Pour VERIFIER les droits d'authentification de l'utilisateur (mesure de sécurité)
      if (post.userId != req.auth.userId) {
        // 'userId' (BdD) comparé à 'userId' (token)
        return res.status(401).json({ message: "Non-autorisé !" }); // (pas besoin de 'else' car 'return' stop le procès)
      }
      // Création d'une nouvelle instance (= exemplaire) de la classe (= model) 'Post' (importée plus haut avec 'db')
      let newPost = {
        titre: req.body.titre, // Body de la requête (du 'front-end') (données entrées par le user)
        //auteur: req.body.auteur, // (c.f info dans 'model post')
        contenu: req.body.contenu, // Body de la requête (du 'front-end') (données entrées par le user)
      };
      // Si présence d'une 'image' dans le nouveau 'post'
      if (req.file) {
        // Pour GENERER l'URL de l'image (par nous-même, car 'Multer' ne délivre que le nom du fichier, en utilisant des propriétés de l'objet 'requête' : protocole - nom d'hôte - nom du dossier - nom du fichier (délivré par 'Multer'))
        newPost.imageUrl = `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`; // 'req.file.filename' = nom de fichier donné par 'multer' pour récupérer l'image
      }
      // Pour ENREGISTRER la modification du 'post' dans 'MySQL' (BdD)
      db.post
        .update(
          newPost, // en 1er : les valeurs du changement
          { where: { id: req.params.id } }
        ) // en 2ème : la cible des changements
        .then(() => {
          // Pour SUPPRIMER l'ancienne image du dossier 'images' (dans le cas où il y aurait une image)
          if (req.file) {
            // 1ère étape : RECUPERER le filename de l'ancienne image
            const filename = post.imageUrl.split("/images/")[1]; // 'filename' récupéré dans 'MySQL' (BdD) (qui sera supprimé du fichier 'images' si modifié) - 'post' = ancien post (data du 'then') - 'split' : Permet de RECUPERER le nom de fichier (autour du répertoire 'images')
            // 2ème étape : SUPPRIMER l'ancienne image du dossier 'images'
            fs.unlink(`images/${filename}`, () => {});
          }
          return res.status(200).json({ message: "Post modifié !" });
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Pour GERER la route 'DELETE' : On EXPORTE la fonction 'deleteOnePost' pour la suppression d'un objet ('post') dans 'MySQL' (BdD)
exports.deleteOnePost = (req, res, next) => {
  db.post
    .findByPk(req.params.id) // 'findByPk' : recherche par la 'Primary Key' (souvent l'id) - 'id' (présent dans l'URL) de 'post' dans 'MySQL' (BdD)
    .then((post) => {
      // 'post' (= data (données) du résultat de la requête du front-end (réponse contenue dans la promesse)) : récupéré (en 'entier') par son 'id' dans 'MySQL' (BdD)
      // Pour VERIFIER les droits d'authentification de l'utilisateur (mesure de sécurité)
      if (post.userId != req.auth.userId) {
        // 'userId' (BdD) comparé à 'userId' (token)
        return res.status(401).json({ message: "Non-autorisé !" }); // (pas besoin de 'else' car 'return' stop le procès)
      }
      // Pour SUPPRIMER l'image du dossier 'images' (s'il y en a une) :
      if (post.imageUrl) {
        // 1ère étape : RECUPERER le filename (= nom du fichier) dans l'URL
        const filename = post.imageUrl.split("/images/")[1]; // 'filename' récupéré dans 'MySQL' (BdD) (qui sera supprimé du fichier 'images' si modifié) - 'post' = ancien post (data du 'then') - 'split' : Permet de RECUPERER le nom de fichier (autour du répertoire 'images')
        // 2ème étape : SUPPRIMER l'image du système de fichiers
        fs.unlink(`images/${filename}`, () => {
          // 'unlink' (méthode de 'fs') - '() =>' : Appel de la callback (une fois que la suppression aura eu lieu) (info : la suppression dans le système de fichiers est faite de manière asynchrone)
          // Pour SUPPRIMER l'objet dans 'MySQL' (BdD)
          db.post
            .destroy({ where: { id: req.params.id } }) // = Objet qui sert de filtre (sélecteur) pour DESIGNER celui que l'on souhaite SUPPRIMER : {'id' envoyé dans les paramètres de la requête}
            .then(() => res.status(200).json({ message: "Post supprimé !" })) // Retour de la promesse
            .catch((error) => res.status(401).json({ error })); // Erreur
        });
      } else {
        // Pour SUPPRIMER l'objet dans 'MySQL' (BdD)
        db.post
          .destroy({ where: { id: req.params.id } }) // = Objet qui sert de filtre (sélecteur) pour DESIGNER celui que l'on souhaite SUPPRIMER : {'id' envoyé dans les paramètres de la requête}
          .then(() => res.status(200).json({ message: "Post supprimé !" })) // Retour de la promesse
          .catch((error) => res.status(401).json({ error })); // Erreur
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
