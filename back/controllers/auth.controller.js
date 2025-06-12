const jwt = require('jsonwebtoken');
const { AdminUser } = require('../models');
const { secret, expiresIn } = require('../config/jwt');

/**
 * Contrôleur pour la connexion administrateur
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Rechercher l'utilisateur dans la base de données
    const user = await AdminUser.findOne({ where: { username } });

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      secret,
      { expiresIn }
    );

    // Répondre avec le token et les informations de l'utilisateur
    return res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        id: user.id,
        username: user.username,
        token
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

/**
 * Contrôleur pour vérifier si un token est valide
 */
exports.verifyToken = (req, res) => {
  // Si on arrive ici, c'est que le middleware auth a validé le token
  return res.status(200).json({
    success: true,
    message: 'Token valide',
    data: {
      user: req.user
    }
  });
};

/**
 * Initialiser un compte admin si aucun n'existe
 * Cette fonction sera appelée au démarrage de l'application
 */
exports.initAdminAccount = async () => {
  try {
    const adminCount = await AdminUser.count();
    
    if (adminCount === 0) {
      // Créer un compte admin par défaut
      await AdminUser.create({
        username: 'admin',
        password: 'admin123' // Sera hashé automatiquement via les hooks
      });
      console.log('Compte administrateur par défaut créé');
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du compte admin:', error);
  }
};
