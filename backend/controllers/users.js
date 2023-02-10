// Pour IMPORTER 'tout ce qui concerne la BdD ('MySQL')' (réuni dans le fichier 'dataBase.js')
const db = require("../models/dataBase");

// Pour IMPORTER 'bcrypt' (plug-in 'Crypteur de MdP')
const bcrypt = require("bcrypt");

// Pour IMPORTER 'jsonwebtoken' (plug-in qui permet de CREER des 'tokens' et de les VERIFIER)
const jwt = require("jsonwebtoken");

// Pour ENREGISTRER un nouvel 'user' dans 'MySQL' (BdD)
exports.signup = (req, res, next) => {
  // 'signup' : fonction qui permet de CRYPTER le password
  // Pour 'HACHER' / CRYPTER le password (fonction asynchrone)
  bcrypt
    .hash(req.body.password, 10) // 'req.body.password' ('data'): password présent dans le corps de la requête - '10' ('salt'): nb de fois où l'algorythme de 'hachage' sera exécuté
    // Pour RECUPERER le 'hash' de password
    .then((hash) => {
      // 'hash' CREE par 'bcrypt'
      // Pour AJOUTER le nouvel 'user' dans la table 'users' de 'MySQL' (BdD)
      db.users
        .create({
          // Création d'une instance (= exemplaire) du model 'User'
          pseudo: req.body.pseudo, // 'req.body.pseudo' ('data'): pseudo présent dans le corps de la requête
          email: req.body.email, // 'req.body.email' ('data'): email présent dans le corps de la requête
          password: hash, // 'hach' CREE (plus haut) par 'bcrypt'
        })
        .then((newUser) => {
          return res.status(201).json(newUser);
        })
        .catch((error) => res.status(400).json({ err: error }));
    })
    .catch((error) => res.status(500).json({ err: error })); // (erreur 'server')
};

// Pour CONNECTER des utilisateurs existants
exports.login = (req, res, next) => {
  // 'login' : fonction qui permet de VERIFIER si un 'user' existe dans la BdD ('MySQL') et si le MdP entré par le 'user' correspont à ce 'user'
  db.users
    .findOne({ where: { email: req.body.email } }) // '{}' = objet (sélecteur qui va servir de filtre) - 'req.body.email': valeur transmise par le 'user'
    .then((user) => {
      // 'user': valeur récupérée par la requête
      // Pour SAVOIR si le 'user' a été trouvé dans la BdD
      if (user === null) {
        // Si 'user' pas trouvé
        return res
          .status(401)
          .json({ message: "Paire identifiant / mot de passe incorrecte" }); // Ce message permet de préserver la confidentialité des 'users' concernant leur information personnelle: 'inscrit' ou 'non-inscrit'
      } else {
        // Sinon
        bcrypt
          .compare(req.body.password, user.password) // 'compare' : fonction (de bcrypt) qui permet de VERIFIER si le MdP entré par le 'user' est correct, en le comparant à celui stocké dans la BdD - (MdP entré par le 'user' - MdP stocké dans la BdD)
          .then((valid) => {
            if (!valid) {
              // Si MdP incorrect
              return res
                .status(401)
                .json({
                  message: "Paire identifiant / mot de passe incorrecte",
                }); // Ce message permet de préserver la confidentialité des 'users' concernant leur information personnelle: 'inscrit' ou 'non-inscrit'
            } else {
              // Sinon
              return res.status(200).json({
                // objet qui contient les infos nécessaires à l'authentification des requêtes émises plutard par le 'user'
                userId: user.id,
                token: jwt.sign(
                  // 'sign' : fonction (de 'jsonwebtoken') qui permet
                  { userId: user.id }, // données que l'on souhaite encodées à l'intérieur du 'token' (appelées le 'payload')
                  process.env.tokenKey, // clé secrète (pour l'encodage : CRYPTER les 'token')
                  { expiresIn: "24h" } // 'expiresIn' : durée de validité du 'token' avant expiration
                ),
              });
            }
          })
          .catch((error) => res.status(500).json({ err: error })); // Erreur 'server': est une erreur d'exécution de requête dans la BdD (différent de l'erreur 404 : 'champ pas trouvé dans la BdD')
      }
    })
    .catch((error) => res.status(500).json({ err: error })); // (erreur 'server')
};
