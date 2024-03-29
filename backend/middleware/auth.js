// Pour IMPORTER 'jsonwebtoken' (plug-in qui permet de CREER des 'tokens' et de les VERIFIER)
const jwt = require("jsonwebtoken");

// Création d'un 'middleware' (logiciel intermédiaire) qui:
// - permet d'extraire les informations contenues dans le 'token' (et de vérifier que le 'token' est valide)
// - vérifie que l'utilisateur est connecté
// - transmet les infos de connexion aux méthodes qui GERENT les requêtes (autres 'middlewares' ou gestionnaires de routes)

// Pour EXPORTER une fonction (qui sera le middleware)
module.exports = (req, res, next) => {
  // Pour GERER les erreurs
  try {
    // Pour RECUPERER le 'token' (récupération de l'autorisation)
    const token = req.headers.authorization.split(" ")[1]; // 'split': fonction qui permet de DIVISER une 'string' en un tableau autour de l'espace qui se trouve entre le mot-clé 'error' et le 'token' - '[1]' : position du 'token' dans le tableau
    // Pour DECODER le 'token'
    const decodedToken = jwt.verify(token, process.env.tokenKey); // 'verify': fonction de ('jsonwebtoken') qui permet de DECODER le token récupéré - (token récupéré , clé secrète)
    // Pour RECUPERER le 'userId' (dans le token)
    const userId = decodedToken.userId; // (variable détruite à la fin du bloc -> sa valeur va être ajoutée à 'req' pour ne pas être perdue)
    // Pour RECUPERER le 'isAdmin' (dans le token)
    const isAdmin = decodedToken.isAdmin; // (variable détruite à la fin du bloc -> sa valeur va être ajoutée à 'req' pour ne pas être perdue)
    // Pour RAJOUTER le 'userId' à la 'requête' (du 'front-end') (qui sera transmis aux routes afin qu'elles puissent l'exploiter)
    req.auth = {
      // (objet transmis au prochain élément de la route)
      userId: userId,
      isAdmin: isAdmin,
    };
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Requête non autorisée ! (problème d'authentification)" });
  }
};
