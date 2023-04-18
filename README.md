# LaurieBezacier_7_07102022 : Application Web 'Groupomania' (comprenant le site (front-end) et l'API (back-end))

OpenClassrooms : Formation 'Développement Web' - [Projet 7 : Création d'un réseau social d'entreprise](https://course.oc-static.com/projects/DWJ_FR_P7/DW+P7+28-09-2022+Sce%CC%81nario.pdf)

## Objectifs du projet :

Développer l'intégralité d'un Réseau social interne pour les employés de **"Groupomania"**. Le but de cet outil est de faciliter les intéractions entre collègues de travail, par le biais de plusieurs fonctionnalités pour favoriser leurs échanges.

## Compétences évaluées :

- Authentifier un utilisateur et maintenir sa session
- Implémenter un stockage de données sécurisé en utilisant une base de données (MySQL)
- Développer l'interface d'un site Web grâce à un framework front-end (React JS)

## Outils utilisés pour l'intégration du back-end :

- Serveur : **Node.js** (+ nodemon)
- Framework : **Express**
- Base de données : **MySQL**
  - Hébergement : PHP MyAdmin (WAMP)
  - Opérations réalisées relatives à la BdD : sequelize
- Protocole respecté : **API REST**
- Gestionnaire de fichiers (exemple : images) : **Multer**

## Mesures de sécurité mises en place :

- Hashage du mot de passe utilisateur : **bcrypt**
- Manipulation sécurisée de la BdD : **sequelize**
- Vérification du caractère unique de l'email utilisateur, dans la BdD : **sequelize (contraintes & validations)**
- Utilisation de variables d'environnement pour les données sensibles ('path' vers MongoDB et clé secrète) : **dotenv**
- Authentification de l'utilisateur par token : **jsonwebtoken**
- Protection des headers HTTP retournés par l'application 'Express' : **helmet**
- Enregistrement des données (log) de chaque requête effectuée dans un fichier "assess.log" : **morgan**
- Prévention des attaques (comme la 'force brute') : **express-rate-limit**

## Pour tester l'application :

1. Configuration des **dossiers (et fichiers)** :
   - Cloner l'[Application Web 'Groupomania'](https://github.com/LauryF/Laurie_Bezacier_7_07102022.git) (sur GitHub)
   - Ajouter un dossier 'images' à la racine du dossier 'backend'
   - De même, ajouter un fichier de configuration nommé ".env" à la racine du dossier 'backend'
   - A l'intérieur de ce dossier, 'copier / coller' ces 2 variables d'environnement "secrètes":
     - passwordMS = "MySqL17@40-2"
     - tokenKey = 'clé_secrète_pour_crypter_les_tokens'
2. Configuration du **front-end** :
   - Lancer le front-end de l'application :
     - Dans un (premier) terminal, accéder au dossier 'frontend' (--> 'cd frontend')
     - Puis, installer les dépendances (--> 'npm install')
     - Enfin, lancer le front-end (--> 'npm run start')
3. Configuration du **back-end** :
   - Lancer le back-end de l'application :
     - Dans un (deuxième) terminal, accéder au dossier 'backend' (--> 'cd backend')
     - Puis, installer les dépendances (--> 'npm install')
     - Enfin, lancer 'node server' (Info : Pour une relance automatique du server : installer 'nodemon' (--> 'npm install -g nodemon'))
4. Accès à l'**Application Web 'Groupomania'** (dans un navigateur Web) :
   - Le front-end est accessible à l'adresse http://localhost:3001 .

> **Important** : Pour des tests spécifiques (avec par exemple 'Postman'), le back-end répond à l'adresse : http://localhost:3000 (**Attention** : Authentification requise pour toutes les routes '/api/post/').
