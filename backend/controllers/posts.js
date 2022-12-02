// Pour IMPORTER 'tout ce qui concerne 'MySQL' (BdD)' (réuni dans le fichier 'dataBase.js')
const db = require('../models/dataBase');

// Pour IMPORTER 'fs' ('fs' : 'file system' = 'système de fichiers' - c'est un des packages de 'NodeJS' - il permet de supprimer un fichier du système de fichiers)
const fs = require('fs');

// POSTS :

// Pour GERER la route 'GET' : On EXPORTE la fonction 'findAllPosts' pour la récupération de tous les objets ('post') présents dans MySQL (BdD)
exports.findAllPosts = (req, res, next) => {
  // Pour TROUVER / RECUPERER la liste complète des 'posts' dans 'MySQL' (BdD)
  db.posts.findAll()
    .then(resultFindAll => res.status(200).json(resultFindAll)) // Retour d'une promesse (=> 'resultFindAll' : renvoie d'un tableau contenant toutes les 'posts' présentes dans MySQL (BdD))
    .catch(error => res.status(400).json({ error })); // Erreur
};

// Pour GERER la route 'GET' : On EXPORTE la fonction 'findOnePost' pour la récupération d'un objet ('post'), particulier, présent dans MySQL (BdD)
exports.findOnePost = (req, res, next) => {
  db.posts.findOne({ id: req.params.id })
    .then(resultFindOne => res.status(200).json(resultFindOne)) // Retour d'une promesse (=> 'resultFindOne' : renvoie 'Post' dans 'Posts' présent dans MySQL (BdD))
    .catch(error => res.status(404).json({ error })); // Erreur (objet non trouvé)
};

// Pour GERER la route 'POST' : On EXPORTE la fonction 'createPost' pour la création d'un objet ('post') dans 'MySQL' (BdD)
exports.createPost = (req, res, next) => {
  // Pour PARSER l'objet 'requête' (comme l'objet (= 'clé / valeur') est reçu sous la forme d'une string, car envoyée en 'form-data', elle est PARSEE en objet json pour pouvoir être utilisée)
  const postReq = JSON.parse(req.body.post); // 'post' : post dans le body de la requête du 'front-end'
  // Pour SUPPRIMER (dans l'objet) les champs 'id' (car l'id de l'objet va être généré automatiquement par 'MySQL' (BdD)) et 'userId' (qui correspond à la personne qui a créé l'objet) (on utilise désormais le 'userId' qui vient du token d'authentification (pour être sur qu'il soit valide)) (car il ne faut JAMAIS faire confiance aux clients) (pas besoin, car on utilise pas '...postReq' plus bas)
  //delete postReq.id;
  //delete postReq.userId;
  // Pour ENREGISTRER un nouvel objet 'post' dans 'MySQL' (BdD)
  db.posts.create({ // Création d'une instance (= exemplaire) de la classe (= model) 'Post' (importée plus haut avec 'db')
    //...postReq, // Déconstruction de l'objet 'post' (constitué de 'clé / valeur') que le front-end a envoyé (Ne pas utiliser cette méthode car pas sécurisé -> utiliser à la place la liste de ce que l'on souhaite récupérer dans la requête du front-end)
    // // (Récupérés dans la 'requête' du 'front-end')
    titre: postReq.titre,
    auteur: postReq.auteur,
    contenu: postReq.contenu,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    userId: req.auth.userId // 'userId' = extrait de l'objet 'requête' grâce au middleware 'auth' - Ou 'res.locals.auth.userId' à la place de "req.auth.userId"
    // Pour GENERER l'URL de l'image (par nous-même, car 'Multer' ne délivre que le nom du fichier, en utilisant des propriétés de l'objet 'requête' : protocole - nom d'hôte - nom du dossier - nom du fichier (délivré par 'Multer'))
  })
    .then(() => res.status(200).json({ message: 'Nouveau post créé !' })) // Retour de la promesse
    .catch(error => res.status(400).json({ err: error }));
};

// Pour GERER la route 'PUT' : On EXPORTE la fonction 'updatePost' pour la modification d'un objet ('post') dans MySQL (BdD)
exports.updatePost = (req, res, next) => {
  db.posts.findByPk(req.params.id) // 'findByPk' : recherche par la 'Primary Key' (souvent l'id) - 'id' (présent dans l'URL) de 'post' dans 'MySQL' (BdD)
    .then(post => { // 'post' (= data (données) du résultat de la requête du front-end (réponse contenue dans la promesse)) : récupéré (en 'entier') par son 'id' dans 'MySQL' (BdD)
      // Pour VERIFIER les droits d'authentification de l'utilisateur (mesure de sécurité)
      if (post.userId != req.auth.userId) { // 'userId' (BdD) comparé à 'userId' (token)
        return res.status(401).json({ message: 'Non-autorisé !' }); // (pas besoin de 'else' car 'return' stop le procès)
      }
      let newPost; // déclaration de la variable MAIS pas d'affectation (car affectation conditionnelle faite par la suite) - post que l'on veut sauvegarder (newPost)
      // Modification d'un objet -> 2 cas possibles : PRESENCE ou ABSCENCE d'un fichier dans l'objet à modifier
      // Astuce : Pour SAVOIR si la requête a été faite avec un fichier dans l'objet, il faut regarder s'il y a un champ 'file' dans l'objet 'requête' ('req')
      if (req.file) { // Cas 1 : L'utilisateur a transmis un fichier 
        // Pour PARSER la chaîne de caractères
        let bodyReq = JSON.parse(req.body.post); // = 'post' dans le body de la requête (du 'front-end') (données entrées par le user)
        // Pour RECUPERER l'objet 'post' (du 'front-end')
        newPost = { // affectation conditionnelle de la variable 'newPost'
          titre: bodyReq.titre,
          auteur: bodyReq.auteur,
          contenu: bodyReq.contenu,
          // Pour GENERER l'URL de l'image
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // 'req.file.filename' = nom de fichier donné par 'multer' pour récupérer l'image
        };
      }
      else { // Cas 2 : L'utilisateur n'a pas transmis de fichier
        let bodyReq = req.body;
        // Pour RECUPERER l'objet 'post' (du 'front-end')
        newPost = { // affectation conditionnelle de la variable 'newPost'
          titre: bodyReq.titre, // Body de la requête (du 'front-end') (données entrées par le user)
          auteur: bodyReq.auteur, // Body de la requête (du 'front-end') (données entrées par le user)
          contenu: bodyReq.contenu // Body de la requête (du 'front-end') (données entrées par le user)
        };
      }

      // Pour ENREGISTRER la modification dans 'MySQL' (BdD)
      db.posts.update(
        newPost, // en 1er : les valeurs du changement
        { where: { id: req.params.id } }) // en 2ème : la cible des changements
        .then(() => {
          // Pour SUPPRIMER l'ancienne image du dossier 'images' (dans le cas où il y aurait une image)
          if (req.file){
            // 1ère étape : RECUPERER le filename de l'ancienne image
            const filename = post.imageUrl.split('/images/')[1]; // 'filename' récupéré dans 'MySQL' (BdD) (qui sera supprimé du fichier 'images' si modifié) - 'post' = ancien post (data du 'then') - 'split' : Permet de RECUPERER le nom de fichier (autour du répertoire 'images') 
            // 2ème étape : SUPPRIMER l'ancienne image du dossier 'images'
            fs.unlink(`images/${filename}`, () => { })
          }
          return res.status(200).json({ message: 'Post modifié !' })
        })
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Pour GERER la route 'DELETE' : On EXPORTE la fonction 'deleteAllPosts' pour la suppression de tous les objets ('post') dans 'MySQL' (BdD) - ATTENTION : Seulement possible par l'ADMIN !
exports.deleteAllPosts = (req, res, next) => {
  db.posts.findAll(req.params.id) // 'id' (présent dans l'URL) de 'post' dans 'MySQL' (BdD)
    .then(post => { // 'post' (= data (données) du résultat de la requête du front-end (réponse contenue dans la promesse)) : récupéré (en 'entier') par son 'id' dans 'MySQL' (BdD)
      // Pour VERIFIER les droits d'authentification de l'utilisateur (mesure de sécurité)
      if (post.userId != req.auth.userId) { // 'userId' (BdD) comparé à 'userId' (token)
        return res.status(401).json({ message: 'Non-autorisé !' }); // (pas besoin de 'else' car 'return' stop le procès)
      }
      // Pour SUPPRIMER l'image du dossier 'images' :
      // 1ère étape : RECUPERER le filename (= nom du fichier) dans l'URL
      const filename = post.imageUrl.split('/images/')[1]; // 'filename' récupéré dans 'MySQL' (BdD) (qui sera supprimé du fichier 'images' si modifié) - 'post' = ancien post (data du 'then') - 'split' : Permet de RECUPERER le nom de fichier (autour du répertoire 'images')
      // 2ème étape : SUPPRIMER l'image du système de fichiers
      fs.unlink(`images/${filename}`, () => { // 'unlink' (méthode de 'fs') - '() =>' : Appel de la callback (une fois que la suppression aura eu lieu) (info : la suppression dans le système de fichiers est faite de manière asynchrone)
        // Pour SUPPRIMER l'objet dans 'MySQL' (BdD)
        db.posts.destroy({ where: { id: req.params.id } }) // = Objet qui sert de filtre (sélecteur) pour DESIGNER celui que l'on souhaite SUPPRIMER : {'id' envoyé dans les paramètres de la requête}
          .then(() => res.status(200).json({ message: 'Tous les posts sont supprimés !' })) // Retour de la promesse
          .catch(error => res.status(401).json({ error })); // Erreur
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Pour GERER la route 'DELETE' : On EXPORTE la fonction 'deleteOnePost' pour la suppression d'un objet ('post') dans 'MySQL' (BdD)
exports.deleteOnePost = (req, res, next) => {
  db.posts.findByPk(req.params.id) // 'findByPk' : recherche par la 'Primary Key' (souvent l'id) - 'id' (présent dans l'URL) de 'post' dans 'MySQL' (BdD)
    .then(post => { // 'post' (= data (données) du résultat de la requête du front-end (réponse contenue dans la promesse)) : récupéré (en 'entier') par son 'id' dans 'MySQL' (BdD)
      // Pour VERIFIER les droits d'authentification de l'utilisateur (mesure de sécurité)
      if (post.userId != req.auth.userId) { // 'userId' (BdD) comparé à 'userId' (token)
        return res.status(401).json({ message: 'Non-autorisé !' }); // (pas besoin de 'else' car 'return' stop le procès)
      }
      // Pour SUPPRIMER l'image du dossier 'images' :
      // 1ère étape : RECUPERER le filename (= nom du fichier) dans l'URL
      const filename = post.imageUrl.split('/images/')[1]; // 'filename' récupéré dans 'MySQL' (BdD) (qui sera supprimé du fichier 'images' si modifié) - 'post' = ancien post (data du 'then') - 'split' : Permet de RECUPERER le nom de fichier (autour du répertoire 'images')
      // 2ème étape : SUPPRIMER l'image du système de fichiers
      fs.unlink(`images/${filename}`, () => { // 'unlink' (méthode de 'fs') - '() =>' : Appel de la callback (une fois que la suppression aura eu lieu) (info : la suppression dans le système de fichiers est faite de manière asynchrone)
        // Pour SUPPRIMER l'objet dans 'MySQL' (BdD)
        db.posts.destroy({ where: { id: req.params.id } }) // = Objet qui sert de filtre (sélecteur) pour DESIGNER celui que l'on souhaite SUPPRIMER : {'id' envoyé dans les paramètres de la requête}
          .then(() => res.status(200).json({ message: 'Post supprimé !' })) // Retour de la promesse
          .catch(error => res.status(401).json({ error })); // Erreur
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// LIKES / DISLIKES :

exports.createLike = (req, res, next) => {

  const userId = req.auth.userId; // 'userId' dans le HEADER de la requête (du 'front-end') (vient du token)
  const likeValue = req.body.valeur; // 'valeur' dans le BODY de la requête (du 'front-end') = '1' ou '0' ou '-1'
  const postId = req.params.id; // 'id' dans l'URL' de la requête (du 'front-end') (identique à celui de la route de 'post')

  db.likes.create({
    userId: userId,
    postId: postId,
    valeur: likeValue
  })
    .then(() => res.status(200).json({ message: 'Like enregistré !' }))
    .catch(error => res.status(400).json({ err: error }));
};

// // Pour RECUPERER tous les 'likes'
// exports.findAllLikes = (req, res, next) => {

//   db.likes.findAll({
//     where: {
//       postId: req.params.postId
//     }
//   })
//     .then(likes => {
//       console.log(likes);
//       res.status(200).json({ data: likes });
//     })
//     .catch(error => res.status(400).json({ error }));
// };