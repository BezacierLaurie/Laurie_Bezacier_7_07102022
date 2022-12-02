// Pour IMPORTER 'sequelize' (ORM 'SQL')
const { Sequelize } = require('sequelize');

// Connexion à 'MySQL' (BdD) (doit être appelée à chaque fois qu'il y a besoin de se connecter à 'MySQL' (BdD)) 
const sequelize = new Sequelize("groupomania", "root", process.env.passwordMS, { // Informations d'identification de 'MySQL' (BdD)
    host: "localhost", dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// 'db' => objet (vide), qui va contenir toutes les clés / valeurs suivantes (tout ce qui concerne 'MySQL' (BdD)) :
const db = {};

// Connexion à 'MySQL' (BdD) - port 3036 (l.5)
db.sequelize = sequelize; // Dans 'db' : sequelize' = clé (que l'on crée) - 'sequelize' = valeur (Connexion 'MySQL')

// Accès à l'ORM (l.2)
db.Sequelize = Sequelize; // Dans 'db' : Sequelize' = clé (que l'on crée) - 'Sequelize' = valeur (ORM)

// Lien avec le model 'User' (dépendances dont le model a besoin)
db.users = require("./User")(sequelize, Sequelize); // 'users' : nom de la clé (conseil : identique à la table)

// Lien avec le model 'Post' (dépendances dont le model a besoin)
db.posts = require("./Post")(sequelize, Sequelize); // 'posts' : nom de la clé (conseil : identique à la table)

// Lien avec le model 'Like' (dépendances dont le model a besoin)
db.likes = require("./Like")(sequelize, Sequelize); // 'likes' : nom de la clé (conseil : identique à la table)

// Liaisons entre les tables

// Un 'user' peut avoir plusieurs 'posts'
db.users.hasMany(db.posts);

// Un 'user' peut avoir plusieurs 'likes'
db.users.hasMany(db.likes);

// Un 'post' peut avoir plusieurs 'likes'
db.posts.hasMany(db.likes);

// Un 'post' appartient à un seul 'user'
db.posts.belongsTo(db.users);

// Un 'like' appartient à un seul 'post'
db.likes.belongsTo(db.posts);

// Un 'like' appartient à un seul 'user'
db.likes.belongsTo(db.users);

// Pour EXPORTER 'db'
module.exports = db;