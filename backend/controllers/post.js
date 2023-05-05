// Pour IMPORTER 'Op' (de 'sequelize')
const { Op } = require("sequelize");

// Pour IMPORTER 'tout ce qui concerne 'MySQL' (BdD)' (réuni dans le fichier 'dataBase.js')
const db = require("../models/dataBase");

// Pour IMPORTER 'fs' ('fs' : 'file system' = 'système de fichiers' - c'est un des packages de 'NodeJS' - il permet de supprimer un fichier du système de fichiers)
const fs = require("fs");

// POST

// Pour GERER la route 'GET' : On EXPORTE la fonction 'findAllPosts' pour la récupération de tous les objets ('post') présents dans MySQL (BdD)
exports.findAllPosts = (req, res, next) => {
  console.log("Controller appelé : 'post.findAll'"); // "nom du controller + methode" -> Permet de vérifier quel controller est appellé
  // Pour TROUVER / RECUPERER la liste complète des 'posts' dans 'MySQL' (BdD)
  db.post
    .findAll({
      // Permet de RECUPERER en même temps les 'users' et les 'likes' associés au 'post'
      include: [
        {
          model: db.user,
        },
        {
          model: db.like,
        },
      ],
      order: [["createdAt", "DESC"]],
    })
    .then((resultFindAll) => res.status(200).json(resultFindAll)) // Retour d'une promesse (=> 'resultFindAll' : renvoie d'un tableau contenant tous les 'posts' présents dans MySQL (BdD))
    .catch((error) => res.status(400).json({ error })); // Erreur
};

// Pour GERER la route 'GET' : On EXPORTE la fonction 'findOnePost' pour la récupération d'un objet ('post'), particulier, présent dans MySQL (BdD)
exports.findOnePost = (req, res, next) => {
  console.log("Controller appelé : 'post.findOne'"); // "nom du controller + methode" -> Permet de vérifier quel controller est appellé
  db.post
    .findByPk(
      // Pour RECUPERER un 'post' (recherché par la clé primaire, au lieu de 'where' + '{id}')
      req.params.id,
      {
        // Permet de RECUPERER en même temps le 'user' et le 'like' associés au 'post'
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
  console.log("Controller appelé : 'post.create'"); // "nom du controller + methode" -> Permet de vérifier quel controller est appellé
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
  console.log("Controller appelé : 'post.update'"); // "nom du controller + méthode" -> Permet de vérifier quel controller est appellé
  db.post
    .findByPk(req.params.id) // 'findByPk' : recherche par la 'Primary Key' (souvent l'id) - 'id' (présent dans l'URL) de 'post' dans 'MySQL' (BdD)
    .then((post) => {
      // 'post' (= data) du résultat de la requête du front-end (réponse contenue dans la promesse)) : récupéré (en 'entier') par son 'id' dans 'MySQL' (BdD)
      // Pour VERIFIER les droits d'authentification de l'utilisateur ou si user n'est pas admin (mesure de sécurité)
      if (!isOwnerOrAdmin(post.userId, req.auth)) {
        // 'post.userId' (BdD) , 'req.auth' : objet transmis par 'auth' ('userId' et 'isAdmin')
        return res.status(401).json({ message: "Non-autorisé !" }); // (pas besoin de 'else' car 'return' stop le procès)
      }
      // Création d'une nouvelle instance (= exemplaire) de la classe (= model) 'Post' (importée plus haut avec 'db')
      let newPost = {
        titre: req.body.titre, // Body de la requête (du 'front-end') (données entrées par le user)
        //auteur: req.body.auteur, // (c.f info dans 'model post')
        contenu: req.body.contenu, // Body de la requête (du 'front-end') (données entrées par le user)
      };
      // Pour DETERMINER la valeur de 'imageUrl'
      // Si ajout (ou remplacement) de 'image' dans le nouveau 'post'
      if (req.file) {
        // Pour GENERER l'URL de l'image (par nous-même, car 'Multer' ne délivre que le nom du fichier, en utilisant des propriétés de l'objet 'requête' : protocole - nom d'hôte - nom du dossier - nom du fichier (délivré par 'Multer'))
        newPost.imageUrl = `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`; // 'req.file.filename' = nom de fichier donné par 'multer' pour récupérer l'image
        console.log("Nouvelle image enregistrée");
      }
      // Sinon (si suppression de l'image dans le nouveau 'post')
      else if (req.body.image == "DELETED") {
        newPost.imageUrl = ""; // 'imageUrl' est ajouté dans le nouvel objet 'post' pour le cas où l'image (dans le post initial) aurait été supprimée par le user dans le front-end (modification du 'post')
        console.log("Image supprimée");
      }
      // Sinon (image inchangée)
      else {
        console.log("Image conservée");
      }
      // Pour ENREGISTRER la modification du 'post' dans 'MySQL' (BdD)
      db.post
        .update(
          newPost, // en 1er : les valeurs du changement
          {
            where: { id: req.params.id }, // en 2ème : la cible des changements
          }
        )
        .then(() => {
          console.log("Post modifié : ", post.id);
          // Pour VERIFIER si présence d'une image initiale et nouvelle image différente de l'initiale, avant de procéder à la suppression de l'ancienne image (dans le dossier 'images')
          if (post.imageUrl && newPost.imageUrl != post.imageUrl) {
            // 1ère étape : RECUPERER le filename de l'ancienne image
            const filename = post.imageUrl.split("/images/")[1]; // 'filename' récupéré dans 'MySQL' (BdD) (qui sera supprimé du fichier 'images' si modifié) - 'post' = ancien post (data du 'then') - 'split' : Permet de RECUPERER le nom de fichier (autour du répertoire 'images')
            // 2ème étape : SUPPRIMER l'ancienne image du dossier 'images' (si elle existe)
            fs.unlink(`images/${filename}`, () => {});
          }
          return res
            .status(200)
            .json({ message: "Post modifié et màj du dossier 'images' !" });
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Pour GERER la route 'DELETE' : On EXPORTE la fonction 'deleteOnePost' pour la suppression d'un objet ('post') dans 'MySQL' (BdD)
exports.deleteOnePost = (req, res, next) => {
  console.log("Controller appelé : 'post.delete'"); // "nom du controller + methode" -> Permet de vérifier quel controller est appellé
  db.post
    .findByPk(req.params.id) // 'findByPk' : recherche par la 'Primary Key' (souvent l'id) - 'id' (présent dans l'URL) de 'post' dans 'MySQL' (BdD)
    .then((post) => {
      // 'post' (= data (données) du résultat de la requête du front-end (réponse contenue dans la promesse)) : récupéré (en 'entier') par son 'id' dans 'MySQL' (BdD)
      // Pour VERIFIER les droits d'authentification de l'utilisateur ou si user n'est pas admin (mesure de sécurité)
      if (!isOwnerOrAdmin(post.userId, req.auth)) {
        // 'post.userId' (BdD) , 'req.auth' : objet transmis par 'auth' ('userId' et 'isAdmin')
        return res.status(401).json({ message: "Suppression non-autorisé !" }); // (pas besoin de 'else' car 'return' stop le procès)
      }
      // Pour SUPPRIMER l'image du dossier 'images' (s'il y en a une) :
      if (post.imageUrl) {
        // 1ère étape : RECUPERER le filename (= nom du fichier) dans l'URL
        const filename = post.imageUrl.split("/images/")[1]; // 'filename' récupéré dans 'MySQL' (BdD) (qui sera supprimé du fichier 'images' si modifié) - 'post' = ancien post (data du 'then') - 'split' : Permet de RECUPERER le nom de fichier (autour du répertoire 'images')
        // 2ème étape : SUPPRIMER l'image du système de fichiers
        fs.unlink(`images/${filename}`, () => {
          // 'unlink' (méthode de 'fs') - '() =>' : Appel de la callback (une fois que la suppression aura eu lieu) (info : la suppression dans le système de fichiers est faite de manière asynchrone)
          // Et pour SUPPRIMER l'objet dans 'MySQL' (BdD)
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

// function 'owner' (= propriétaire) ou admin (= administrateur)
function isOwnerOrAdmin(owner, loggedUser) {
  // Vérif : Si le user n'est pas connecté (= pas passé par 'login')
  if (!loggedUser) {
    return false;
  }
  // Si le user connecté est propriétaire (sans être administrateur)
  if (loggedUser.userId === owner) {
    return true;
  }
  // Si le user connecté est administrateur
  if (loggedUser.isAdmin) {
    return true;
  }
  // Le user est connecté mais n'est ni propriétaire ni administrateur
  return false;
}

// LIKE

// Pour CREER un 'like'
exports.createLike = (req, res, next) => {
  console.log("Controller appelé : 'post.like.create'"); // "nom du controller + methode" -> Permet de vérifier quel controller est appellé
  const userId = req.auth.userId; // 'userId' dans le HEADER de la requête (du 'front-end') (vient du token)
  const postId = req.params.id; // 'id' dans l'URL de la requête (du 'front-end') (identique à celui de la route de 'post')
  db.like
    .create({
      userId: userId,
      postId: postId,
    })
    .then(() => res.status(200).json({ message: "Like enregistré !" }))
    .catch((error) => res.status(400).json({ err: error }));
};

// Pour SUPPRIMER un 'like'
exports.deleteOneLike = (req, res, next) => {
  console.log("Controller appelé : 'post.like.delete'"); // "nom du controller + methode" -> Permet de vérifier quel controller est appellé
  db.like
    .findOne({
      where: {
        [Op.and]: [{ postId: req.params.id }, { userId: req.auth.userId }],
      },
    })
    .then((like) => {
      // 'post' (= data (données) du résultat de la requête du front-end (réponse contenue dans la promesse)) : récupéré (en 'entier') par son 'id' dans 'MySQL' (BdD)
      // Pour VERIFIER les droits d'authentification de l'utilisateur (mesure de sécurité)
      if (like.userId != req.auth.userId) {
        // 'userId' (BdD) comparé à 'userId' (token)
        return res.status(401).json({ message: "Non-autorisé !" }); // (pas besoin de 'else' car 'return' stop le procès)
      }
      // Pour SUPPRIMER l'objet dans 'MySQL' (BdD)
      db.like
        .destroy({
          where: { id: like.id },
        }) // = Objet qui sert de filtre (sélecteur) pour DESIGNER celui que l'on souhaite SUPPRIMER : {'id'} ('id' du 'like')
        .then(() => res.status(200).json({ message: "Like supprimé !" })) // Retour de la promesse
        .catch((error) => res.status(401).json({ error })); // Erreur
    })
    .catch((error) => res.status(500).json({ error }));
};
