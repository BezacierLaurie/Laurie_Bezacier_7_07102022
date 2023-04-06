// Pour IMPORTER 'sequelize' (ORM 'SQL')
const { Sequelize } = require("sequelize");

// Connexion à 'MySQL' (BdD) (doit être appelée à chaque fois qu'il y a besoin de se connecter à 'MySQL' (BdD))
const sequelize = new Sequelize("groupomania", "root", process.env.passwordMS, {
  // Informations d'identification de 'MySQL' (BdD)
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// 'db' => objet (vide), qui va contenir toutes les clés / valeurs suivantes (tout ce qui concerne 'MySQL' (BdD)) :
const db = {};

// Connexion à 'MySQL' (BdD) - port 3036 (l.5)
db.sequelize = sequelize; // Dans 'db' : sequelize' = clé (que l'on crée) - 'sequelize' = valeur (Connexion 'MySQL')

// Accès à l'ORM (l.2)
db.Sequelize = Sequelize; // Dans 'db' : Sequelize' = clé (que l'on crée) - 'Sequelize' = valeur (ORM)

// Lien avec le model 'User' (dépendances dont le model a besoin)
db.user = require("./User")(sequelize, Sequelize); // 'user' : nom de la clé (conseil : identique à la table)

// Lien avec le model 'Post' (dépendances dont le model a besoin)
db.post = require("./Post")(sequelize, Sequelize); // 'post' : nom de la clé (conseil : identique à la table)

// Lien avec le model 'Like' (dépendances dont le model a besoin)
db.like = require("./Like")(sequelize, Sequelize); // 'like' : nom de la clé (conseil : identique à la table)

// Liaisons entre les tables

// Un 'user' peut avoir plusieurs 'posts'
db.user.hasMany(db.post);

// Un 'user' peut avoir plusieurs 'like'
db.user.hasMany(db.like);

// Un 'post' peut avoir plusieurs 'like'
db.post.hasMany(db.like);

// Un 'post' appartient à un seul 'user'
db.post.belongsTo(db.user);

// Un 'like' appartient à un seul 'post'
db.like.belongsTo(db.post);

// Un 'like' appartient à un seul 'user'
db.like.belongsTo(db.user);

// Pour EXPORTER 'db'
module.exports = db;
