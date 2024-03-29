// Pour CREER un nouveau model (= 'table') dans 'MySQL' (BdD)
module.exports = (sequelize, Sequelize) => {
  // Fct fléchée qui permet d'UTILISER 'sequelize' (ORM) et 'Sequelize' (Connexion à 'MySQL' (BdD))
  const Like = sequelize.define(
    "like",
    {
      // 'like' => nom du model définit (il sera le nom (au pluriel) de la table dans 'MySQL' (BdD), CREEE grâce à 'sync' (dans 'app.js'))
      //valeur: { type: Sequelize.INTEGER, defaultValue: 0 },
    },
    // Pour DESACTIVER les 'createdAt' et 'updatedAt' dans 'MySQL' (BdD)
    {
      timestamps: false,
      // Pour qu'un même post ne soit pas liké plusieurs fois par le même user (contrainte)
      uniqueKeys: {
        like_unique: {
          // 'fields' : champs
          fields: ["userId", "postId"],
        },
      },
    }
  );

  // Pour RETOURNER le model 'Like' créé
  return Like;
};
