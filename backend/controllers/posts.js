// Pour IMPORTER 'tout ce qui concerne 'MySQL' (BdD)' (réuni dans le fichier 'dataBase.js')
const db = require('../models/dataBase');

// Pour IMPORTER 'fs' ('fs' : 'file system' = 'système de fichiers' - c'est un des packages de 'NodeJS' - il permet de supprimer un fichier du système de fichiers)
const fs = require('fs');

// POSTS :

// Pour GERER la route 'GET' : On EXPORTE la fonction 'findAll' pour la récupération de tous les objets ('post') présents dans MySQL (BdD)
exports.findAll = (req, res, next) => {
    // Pour TROUVER / RECUPERER la liste complète des 'posts' dans 'MySQL' (BdD)
    db.posts.findAll()
        .then(resultFindAll => res.status(200).json(resultFindAll)) // Retour d'une promesse (=> 'resultFindAll' : renvoie d'un tableau contenant toutes les 'posts' présentes dans MySQL (BdD))
        .catch(error => res.status(400).json({ error })); // Error
};

// Pour GERER la route 'GET' : On EXPORTE la fonction 'findOne' pour la récupération d'un objet ('post'), particulier, présent dans MySQL (BdD)
exports.findOne = (req, res, next) => {
    db.posts.findOne({ id: req.params.id })
        .then(resultFindOne => res.status(200).json(resultFindOne)) // Retour d'une promesse (=> 'resultFindOne' : renvoie 'Post' dans 'Posts' présent dans MySQL (BdD))
        .catch(error => res.status(404).json({ error })); // Error (objet non trouvé)
};

// Pour GERER la route 'POST' : On EXPORTE la fonction 'create' pour la création d'un objet ('post') dans 'MySQL' (BdD)
exports.create = (req, res, next) => {
    // Pour PARSER l'objet 'requête' (comme l'objet (= 'clé / valeur') est reçu sous la forme d'une string, car envoyée en 'form-data', elle est PARSEE en objet json pour pouvoir être utilisée)
    const postReq = JSON.parse(req.body.post); // 'post' : post dans le body de la requête du 'front-end'
    // Pour SUPPRIMER (dans l'objet) les champs 'id' (car l'id de l'objet va être généré automatiquement par 'MySQL' (BdD)) et '_userId' (qui correspond à la personne qui a créé l'objet) (on utilise désormais le 'userId' qui vient du token d'authentification (pour être sur qu'il soit valide)) (car il ne faut JAMAIS faire confiance aux clients)
    delete postReq.id;
    delete postReq.userid;
    // Pour ENREGISTRER un nouvel objet 'post' dans 'MySQL' (BdD)
    db.posts.create({ // Création d'une instance (= exemplaire) de la classe (= model) 'Post' (importée plus haut avec 'db')
        ...postReq, // Déconstruction de l'objet 'post' (constitué de 'clé / valeur') que le front-end a envoyé 
        userId: req.auth.userId, // 'userId' = extrait de l'objet 'requête' grâce au middleware 'auth'
        // Ou 'res.locals.auth.userId'à la place de "req.auth.userId"
        // Pour GENERER l'URL de l'image (par nous-même, car 'Multer' ne délivre que le nom du fichier, en utilisant des propriétés de l'objet 'requête' : protocole - nom d'hôte - nom du dossier - nom du fichier (délivré par 'Multer'))
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    })
        .then(() => res.status(200).json({ message: 'Nouveau post créé !' })) // Retour de la promesse
        .catch(error => res.status(400).json({ err: error }));
};

// Pour GERER la route 'PUT' : On EXPORTE la fonction 'update' pour la modification d'un objet ('post') dans MySQL (BdD)
exports.update = (req, res, next) => {
    db.posts.findByPk(req.params.id) // 'findByPk' : recherche par la 'Primary Key' (souvent l'id) - 'id' (présent dans l'URL) de 'post' dans 'MySQL' (BdD)
        .then(post => { // 'post' (= data (données) du résultat de la requête du front-end (réponse contenue dans la promesse)) : récupéré (en 'entier') par son 'id' dans 'MySQL' (BdD)
            // Pour VERIFIER les droits d'authentification de l'utilisateur (mesure de sécurité)
            if (post.userId != req.auth.userId) { // 'userId' (BdD) comparé à 'userId' (token)
                return res.status(401).json({ message: 'Non-autorisé !' }); // (pas besoin de 'else' car 'return' stop le procès)
            }
            let postReq; // déclaration de la variable MAIS pas d'affectation (car affectation conditionnelle faite par la suite)
            // Modification d'un objet -> 2 cas possibles : PRESENCE ou ABSCENCE d'un fichier dans l'objet à modifier
            // Astuce : Pour SAVOIR si la requête a été faite avec un fichier dans l'objet, il faut regarder s'il y a un champ 'file' dans l'objet 'requête' ('req')
            if (req.file) { // Cas 1 : L'utilisateur a transmis un fichier 
                // Pour RECUPERER l'objet 'post' (du 'front-end')
                postReq = { // affectation conditionnelle de la vairable 'postReq'
                    // Pour PARSER la chaîne de caractères
                    ...JSON.parse(req.body.post),
                    // Pour GENERER l'URL de l'image
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // 'req.file.filename' = nom de fichier donné par 'multer'
                };
            }
            else { // Cas 2 : L'utilisateur n'a pas transmis de fichier
                // Pour RECUPERER l'objet 'post' (du 'front-end')
                postReq = { ...req.body }; // affectation conditionnelle de la vairable 'postReq'
            }

            // Pour SUPPRIMER le 'userId' venant de la requête (pour EVITER qu'un personne crée un objet à son nom, puis le modifie pour le réassigner à une autre personne) (mesure de sécurité)
            delete postReq._userId;

            // Pour ENREGISTRER la modification dans 'MySQL' (BdD)
            db.posts.update(
                { ...postReq, id: req.params.id }, // en 1er : les valeurs du changement
                { where: { id: req.params.id } }) // en 2ème : la cible des changements
                .then(() => {
                    // Pour SUPPRIMER l'ancienne image du dossier 'images' :
                    // 1ère étape : RECUPERER le filename (= nom du fichier) dans l'URL
                    const filename = post.imageUrl.split('/images/')[1]; // 'filename' récupéré dans 'MySQL' (BdD) (qui sera supprimé du fichier 'images' si modifié) - 'split' : Permet de RECUPERER le nom de fichier (autour du répertoire 'images')
                    // 2ème étape : SUPPRIMER l'ancienne image du dossier 'images' et RE-CREER le chemin sur le système de fichiers, basé sur 'post.imageUrl' ('imageUrl' de 'post') dans 'MySQL' (BdD)
                    fs.unlink(`images/${filename}`, () => { })
                    return res.status(200).json({ message: 'Post modifié !' })
                })
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Pour GERER la route 'DELETE' : On EXPORTE la fonction 'delete' pour la suppression d'un objet ('post') dans MySQL (BdD)
exports.deleteOne = (req, res, next) => {
    // Pour VERIFIER les droits de l'utilisateur. Procédé : On RECUPERE l'objet 'userId' dans MySQL (BdD) (pour VERIFIER si c'est bien l'utilisateur à qui appartient cet objet qui cherche à le SUPPRIMER) (mesure de sécurité)
    db.posts.findByPk(req.params.id) // 'findByPk' : recherche par la 'Primary Key' (souvent l'id) - 'id' (présent dans l'URL) de 'post' dans 'MySQL' (BdD)
        .then(post => { // 'post' (= data (données) du résultat de la requête du front-end (réponse contenue dans la promesse)) : récupéré (en 'entier') par son 'id' dans 'MySQL' (BdD)
            // Pour VERIFIER les droits d'authentification de l'utilisateur (mesure de sécurité)
            if (post.userId != req.auth.userId) { // 'userId' (BdD) comparé à 'userId' (token)
                return res.status(401).json({ message: 'Non-autorisé !' }); // (pas besoin de 'else' car 'return' stop le procès)
            }
            // Pour SUPPRIMER l'image du dossier 'images' :
            // 1ère étape : RECUPERER le filename (= nom du fichier) dans l'URL
            const filename = post.imageUrl.split('/images/')[1]; // 'filename' : récupéré dans 'MySQL' (BdD) - 'split' : Permet de RECUPERER le nom de fichier (autour du répertoire 'images')
            // 2ème étape : SUPPRIMER l'image du système de fichiers et RE-CREER le chemin sur le système de fichiers, basé sur 'post.imageUrl' ('imageUrl' de 'post') dans 'MySQL' (BdD)
            fs.unlink(`images/${filename}`, () => { // 'unlink' (méthode de 'fs') - '() =>' : Appel de la callback (une fois que la suppression aura eu lieu) (info : la suppression dans le système de fichiers est faite de manière asynchrone)
                // Pour SUPPRIMER l'objet dans 'MySQL' (BdD)
                db.posts.destroy({ where: { id: req.params.id } }) // = Objet qui sert de filtre (sélecteur) pour DESIGNER celui que l'on souhaite SUPPRIMER : {'id' envoyé dans les paramètres de la requête}
                    .then(() => res.status(200).json({ message: 'Post supprimé !' })) // Retour de la promesse
                    .catch(error => res.status(401).json({ error })); // Error
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// LIKES / DISLIKES :

exports.likePost = (req, res, next) => {

    const userId = req.body.userId; // 'userId' dans le BODY de la requête (du 'front-end')
    const likeValue = req.body.like; // 'like' dans le BODY de la requête (du 'front-end') = '1' ou '0' ou '-1'
    const postId = req.params.id; // 'id' dans l'URL (params = paramètre de l'URL)

    // Pour TROUVER l'objet 'post' dans 'MySQL' (BdD)
    db.posts.findByPk(postId) // 'db.post' = 'instance du model' (importée plus haut) et sert de passerelle vers la collection 'post' dans 'MySQL' (BdD) - 'postId' : paramètre de route dynamique, qui permet de RECUPERER l'objet dans 'MySQL' (BdD)
        // Pour RECUPERER l'objet 'post' dans MySQL (BdD)
        .then(post => { // 'post' (obj) : data (données) du résultat de la requête de 'MySQL' (BdD) (réponse contenue dans la promesse)
            // Si 'post' n'existe pas dans 'MySQL' (BdD)
            if (!post) { // = pas de post - 'post' (obj) : data (données) du résultat de la requête de MySQL (BdD) (réponse contenue dans la promesse)
                // alors 'erreur'
                return res.status(401).json({ message: "Ce post n'existe pas dans la base de donnée !" });
            }
            // Sinon 'post' existe : GERER la valeur du 'like'
            else {
                console.log("Le post existe !");

                // (partie des valeurs (de 'post') que l'on souhaite modifier)
                const newValues = {
                    usersLiked: post.usersLiked,
                    usersDisliked: post.usersDisliked,
                    likes: 0,
                    dislikes: 0
                }

                // LIKE :

                // Pour SUPPRIMER le 'user' du array 'usersLiked'
                if (newValues.usersLiked.includes(userId)) {
                    const index = newValues.usersLiked.indexOf(userId);
                    newValues.usersLiked.splice(index, 1);
                    console.log("Le 'userId' : '" + userId + "' , a bien été supprimé du array 'usersLiked' !");
                    console.log("Vérif : Nombre de 'userId' dans le array 'usersLiked' : " + newValues.usersLiked.length);
                }

                // Pour INSERER un nouvel 'userId' dans le array 'usersLiked'
                if (likeValue == 1) {
                    newValues.usersLiked.push(userId);
                    console.log("Un nouvel 'userId' (" + userId + ") est inscrit dans le array 'usersLiked' !");
                    console.log("Info : user(s) présent(s) dans le array 'usersLiked' : " + newValues.usersLiked);
                };
                // Pour CONNAITRE le nb de 'like' présents dans le tableau 'usersLiked'
                newValues.likes = newValues.usersLiked.length; // 'likes' (de 'postSchema' de 'models')
                console.log("Vérif : Nombre de 'likes' dans le array 'usersLiked' : " + newValues.likes);


                // DISLIKE :

                // Pour SUPPRIMER le 'user' du array 'usersDisLiked'
                if (newValues.usersDisliked.includes(userId)) {
                    const index = newValues.usersDisliked.indexOf(userId);
                    newValues.usersDisliked.splice(index, 1);
                    console.log("Le 'userId' : '" + userId + "' , a bien été supprimé du array 'usersDisliked' !");
                    console.log("Vérif : Nombre de 'userId' dans le array 'usersDisliked' : " + newValues.usersDisliked.length);
                }

                // Pour INSERER un nouvel 'userId' dans le array 'usersDisLiked'
                if (likeValue == -1) {
                    newValues.usersDisliked.push(userId);
                    console.log("Un nouvel 'userId' (" + userId + ") est inscrit dans le array 'usersDisliked' !");
                    console.log("Info : user(s) présent(s) dans le array 'usersDisliked' : " + newValues.usersDisliked);
                };
                // Pour CONNAITRE le nb de 'dislike' présents dans le tableau 'usersDisliked'
                newValues.dislikes = newValues.usersDisliked.length; // 'dislikes' (de 'postSchema' de 'models')
                console.log("Vérif : Nombre de 'likes' dans le array 'usersDisliked' : " + newValues.dislikes);


                // Pour SAUVEGARDER, dans 'MySQL' (BdD), les modifications apportées à 'Post'
                db.posts.update({ id: postId }, newValues)
                    /*                  - 'Post' = 'postSchema' (de 'models') (importée plus haut)
                                        - '{}' : Filtre qui permet de dire quel est l'{enregistrement à mettre à jour} et avec quel {objet}
                                        => objet de comparaison :
                                        -> celui que l'on souhaite modifier (parsé) : {'id' (de 'MySQL' (BdD)) : 'postId' (paramètre de l'URL)}
                                        -> nouvelle version de l'objet : {partie des valeurs (de 'post') que l'on souhaite modifier}
                     */
                    .then(() => res.status(200).json({ message: 'Vote enregistré !' })) // Retour d'une promesse (=> : renvoie d'une réponse positive)
                    .catch(error => res.status(401).json({ error })); // Error
            }
        })
        .catch(error => res.status(500).json({ error })); // Error
};