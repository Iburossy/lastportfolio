const Joi = require('joi');

/**
 * Middleware de validation pour les projets
 */
const validateProject = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10),
    technologies: Joi.array().items(Joi.string()).required(),
    github_link: Joi.string().uri().allow('', null),
    youtube_link: Joi.string().uri().allow('', null),
    image_urls: Joi.array().items(Joi.string()).allow(null)
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      error: error.details[0].message
    });
  }
  
  next();
};

/**
 * Middleware de validation pour la section "About"
 */
const validateAbout = (req, res, next) => {
  // Convertir les données JSON si elles sont sous forme de chaîne
  if (req.body.skills && typeof req.body.skills === 'string') {
    try {
      req.body.skills = JSON.parse(req.body.skills);
    } catch (err) {
      console.error('Erreur lors du parsing des skills:', err);
      return res.status(400).json({
        success: false,
        message: 'Format des compétences invalide',
        error: err.message
      });
    }
  }

  const schema = Joi.object({
    fullName: Joi.string().allow('', null),
    title: Joi.string().allow('', null),
    specialties: Joi.string().allow('', null),
    content: Joi.string().required().min(10),
    skills: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        level: Joi.number().min(0).max(100).required()
      })
    ).required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    console.error('Erreur de validation:', error.details[0].message);
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      error: error.details[0].message
    });
  }
  
  next();
};

/**
 * Middleware de validation pour les messages de contact
 */
const validateContact = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    message: Joi.string().required().min(10).max(1000)
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      error: error.details[0].message
    });
  }
  
  next();
};

/**
 * Middleware de validation pour l'authentification
 */
const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      error: error.details[0].message
    });
  }
  
  next();
};

module.exports = {
  validateProject,
  validateAbout,
  validateContact,
  validateLogin
};
