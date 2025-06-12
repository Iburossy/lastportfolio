# Backend du Portfolio

Ce projet est le backend d'une application de portfolio personnel, construit avec Node.js, Express et MySQL.

## 🚀 Fonctionnalités

- API RESTful pour la gestion des projets, informations personnelles et messages de contact
- Authentification sécurisée avec JWT
- Upload d'images pour les projets
- Envoi d'emails pour les messages de contact
- Base de données MySQL avec Sequelize ORM

## 📋 Prérequis

- Node.js (v14+)
- MySQL (v5.7+)
- npm ou yarn

## 🔧 Installation

1. Cloner le projet
2. Installer les dépendances :
   ```
   npm install
   ```
3. Configurer les variables d'environnement :
   - Copier le fichier `.env.example` en `.env`
   - Remplir les informations de connexion à la base de données et autres configurations

4. Créer la base de données :
   - Utiliser le fichier `utils/database.sql` pour initialiser la structure

5. Démarrer le serveur :
   ```
   npm run dev
   ```

## 🌐 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion administrateur
- `GET /api/auth/verify` - Vérifier la validité du token

### Projets
- `GET /api/projects` - Récupérer tous les projets
- `GET /api/projects/:id` - Récupérer un projet spécifique
- `POST /api/projects` - Ajouter un nouveau projet (protégé)
- `PUT /api/projects/:id` - Mettre à jour un projet (protégé)
- `DELETE /api/projects/:id` - Supprimer un projet (protégé)
- `DELETE /api/projects/:id/image/:imageIndex` - Supprimer une image d'un projet (protégé)

### About
- `GET /api/about` - Récupérer les informations "About"
- `PUT /api/about` - Mettre à jour les informations "About" (protégé)

### Contact
- `POST /api/contact` - Envoyer un message de contact

### Messages
- `GET /api/messages` - Récupérer tous les messages (protégé)
- `DELETE /api/messages/:id` - Supprimer un message (protégé)

## 📦 Structure du projet

```
backend/
│
├── config/                   # Configuration DB, JWT
│   ├── database.js
│   └── jwt.js
│
├── controllers/              # Logique métier
│   ├── auth.controller.js
│   ├── project.controller.js
│   ├── about.controller.js
│   └── contact.controller.js
│
├── middlewares/              # Middlewares Express
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   └── upload.middleware.js
│
├── models/                   # Modèles Sequelize
│   ├── index.js
│   ├── admin.model.js
│   ├── project.model.js
│   ├── about.model.js
│   └── message.model.js
│
├── routes/                   # Routes API
│   ├── auth.routes.js
│   ├── projects.routes.js
│   ├── about.routes.js
│   ├── contact.routes.js
│   └── messages.routes.js
│
├── utils/                    # Utilitaires
│   ├── email.js
│   └── database.sql
│
├── uploads/                  # Dossier pour les images uploadées
├── .env                      # Variables d'environnement
├── index.js                  # Point d'entrée du serveur
└── package.json
```

## 🔒 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Les routes d'administration sont protégées par JWT
- Les en-têtes HTTP sont sécurisés avec Helmet
- La validation des données est effectuée avec Joi
