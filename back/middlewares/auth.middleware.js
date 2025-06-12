const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');
const { AdminUser } = require('../models');

/**
 * Middleware pour vérifier le token JWT et protéger les routes
 */
const verifyToken = async (req, res, next) => {
  try {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Aucun token fourni'
      });
    }

    // Extraire le token (en enlevant "Bearer ")
    const token = authHeader.substring(7);
    
    // Vérifier le token
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Token invalide ou expiré'
        });
      }

      // Vérifier que l'utilisateur existe toujours en base
      const user = await AdminUser.findByPk(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      // Ajouter l'utilisateur à l'objet request
      req.user = {
        id: user.id,
        username: user.username
      };
      
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'authentification',
      error: error.message
    });
  }
};

module.exports = {
  verifyToken
};
