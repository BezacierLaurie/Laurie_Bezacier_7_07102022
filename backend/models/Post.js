// Pour CREER un nouveau model (= 'table') dans 'MySQL' (BdD)
module.exports = (sequelize, Sequelize) => {
  // Fct fléchée qui permet d'UTILISER 'sequelize' (ORM) et 'Sequelize' (Connexion à 'MySQL' (BdD))
  const Post = sequelize.define("post", {
    // 'post' => nom du model définit (il sera le nom (au pluriel) de la table dans 'MySQL' (BdD), CREEE grâce à 'sync' (dans 'app.js'))
    titre: { type: Sequelize.STRING, allowNull: false },
    //auteur: { type: Sequelize.STRING, allowNull: false }, // Correspond à 'userId', donc pas besoin car déjà défini dans 'dataBase.js' avec 'db.post.belongsTo(db.user);'
    contenu: { type: Sequelize.STRING, allowNull: false },
    imageUrl: { type: Sequelize.STRING, allowNull: true },
  });

  // Pour RETOURNER le model 'Post' créé
  return Post;
};
