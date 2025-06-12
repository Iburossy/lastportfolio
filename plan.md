# Structure du Projet Portfolio

## ✨ Stack Utilisée

### Frontend (React 18+)

* React 18+ avec Hooks
* React Router pour la navigation
* Axios pour les appels API
* CSS Modules **ou** Styled Components pour le style
* Framer Motion pour les animations
* React Hook Form pour les formulaires

### Backend (Node.js + Express)

* Node.js avec Express.js
* Sequelize ORM (pour MySQL)
* MySQL2 (driver base de données)
* Cors (requêtes cross-origin)
* Multer (upload de fichiers/images)
* Joi (validation des données)
* Helmet (sécurité HTTP headers)
* bcryptjs (hachage des mots de passe)
* jsonwebtoken (authentification)
* Nodemailer (envoi d'emails)

---

## 🧱 Organisation du Projet

```
portfolio-project/
│
├── backend/
│   ├── config/                   # Connexion DB, JWT secret
│   ├── controllers/              # Logique : projet, auth, contact, etc.
│   ├── middlewares/              # Auth, validation, multer
│   ├── models/                   # Sequelize models
│   ├── routes/                   # Routes API (projects, auth, contact...)
│   ├── utils/                    # Email, helpers
│   ├── uploads/                  # Images des projets
│   └── index.js                  # Entrée principale du serveur
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/               # Logos, icônes, images statiques
│   │   ├── components/           # Navbar, Footer, Cards, etc.
│   │   ├── pages/                # Home, About, Projects, Contact, Detail
│   │   ├── admin/                # Dashboard, Login, Formulaire Projet
│   │   ├── styles/               # CSS modules ou styled-components
│   │   ├── services/             # axios API wrapper
│   │   ├── App.jsx               # Routes et layout
│   │   └── main.jsx              # Entrée React
│   └── package.json
│
├── README.md
└── .env
```

---

## 🤝 Interface d’Administration (Protégée par mot de passe)

* Connexion par mot de passe unique (pas d'inscription)
* Accès protégé via JWT
* Formulaire de login (React Hook Form)
* Token JWT stocké en localStorage
* Middleware Express pour protéger les routes

### Fonctionnalités :

* CRUD des projets (titre, description, images, liens)
* Edition de la page "About Me"
* Consultation des messages du formulaire contact
* Upload d’images avec Multer

---

## 📃 Modèle de la Base de Données (via Sequelize ORM)

### Table `admin_user`

| Champ    | Type            |
| -------- | --------------- |
| id       | INTEGER         |
| username | VARCHAR         |
| password | VARCHAR (hashé) |

### Table `projects`

| Champ         | Type        |
| ------------- | ----------- |
| id            | INTEGER     |
| title         | VARCHAR     |
| description   | TEXT        |
| technologies  | TEXT (JSON) |
| github\_link  | VARCHAR     |
| youtube\_link | VARCHAR     |
| image\_urls   | TEXT (JSON) |
| created\_at   | TIMESTAMP   |

### Table `about`

| Champ   | Type        |
| ------- | ----------- |
| id      | INTEGER     |
| content | TEXT        |
| skills  | TEXT (JSON) |

### Table `messages`

| Champ    | Type      |
| -------- | --------- |
| id       | INTEGER   |
| name     | VARCHAR   |
| email    | VARCHAR   |
| message  | TEXT      |
| sent\_at | TIMESTAMP |

---

## 🔗 API REST (Express)

| Route           | Méthode | Accès  | Description         |
| --------------- | ------- | ------ | ------------------- |
| `/auth/login`   | POST    | Public | Connexion admin     |
| `/projects`     | GET     | Public | Liste de projets    |
| `/projects/:id` | GET     | Public | Détails d’un projet |
| `/projects`     | POST    | Privé  | Ajouter un projet   |
| `/projects/:id` | PUT     | Privé  | Modifier un projet  |
| `/projects/:id` | DELETE  | Privé  | Supprimer un projet |
| `/about`        | GET     | Public | Voir "About Me"     |
| `/about`        | PUT     | Privé  | Modifier "About Me" |
| `/contact`      | POST    | Public | Envoyer un message  |
| `/messages`     | GET     | Privé  | Lire les messages   |

---

## 📆 Prochaine étape ?

1. Souhaites-tu un template de départ pour React avec le routing, axios, etc. ?
2. Souhaites-tu que je te crée le backend Express de base avec Sequelize et JWT ?
3. Tu veux un fichier SQL prêt à importer ?
4. Tu choisis CSS Modules ou Styled Components ?
