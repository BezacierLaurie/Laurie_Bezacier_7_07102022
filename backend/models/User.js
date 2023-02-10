// Pour CREER un nouveau model (= 'table') dans 'MySQL' (BdD)
module.exports = (sequelize, Sequelize) => { // Fct fléchée qui permet d'UTILISER 'sequelize' (ORM) et 'Sequelize' (Connexion à 'MySQL' (BdD))
    const User = sequelize.define('user', { // 'user' => nom du model définit (il sera le nom (au pluriel) de la table dans 'MySQL' (BdD), CREEE grâce à 'sync' (dans 'app.js'))
        pseudo: { type: Sequelize.STRING, allowNull: false, unique: true },
        email: { type: Sequelize.STRING, allowNull: false, unique: true },
        password: {
            type: Sequelize.STRING, allowNull: false,// validate: {is: /^[0-9a-f]{10}$/i} // Ou utilisation de Regex ?
        }
    },
        // Pour DESACTIVER les 'createdAt' et 'updatedAt' dans 'MySQL' (BdD)
        { timestamps: false }
    );

    // Pour RETOURNER le model 'User' créé
    return User;
};
