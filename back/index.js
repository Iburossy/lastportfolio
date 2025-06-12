require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { sequelize } = require('./models');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dossier statique pour les uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/about', require('./routes/about.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/contact-info', require('./routes/contactInfo.routes'));
app.use('/api/messages', require('./routes/messages.routes'));
app.use('/api/intro', require('./routes/intro.routes'));
app.use('/api/experiences', require('./routes/experience.routes'));
app.use('/api/skills', require('./routes/skill.routes'));

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API du portfolio!' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Une erreur est survenue sur le serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    // Synchronisation avec la base de données
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Base de données connectée avec succès.');
    
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
  }
};

startServer();
