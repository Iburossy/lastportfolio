const { Experience } = require('../models');

/**
 * Récupérer toutes les expériences professionnelles
 */
exports.getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.findAll({
      order: [['startDate', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Expériences récupérées avec succès',
      data: experiences
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des expériences:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des expériences',
      error: error.message
    });
  }
};

/**
 * Récupérer une expérience par son ID
 */
exports.getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const experience = await Experience.findByPk(id);
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Expérience non trouvée'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Expérience récupérée avec succès',
      data: experience
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'expérience:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'expérience',
      error: error.message
    });
  }
};

/**
 * Créer une nouvelle expérience
 */
exports.createExperience = async (req, res) => {
  try {
    const { title, company, location, startDate, endDate, current, description } = req.body;
    
    // Validation des champs obligatoires
    if (!title || !company || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Les champs titre, entreprise et date de début sont obligatoires'
      });
    }
    
    // Créer l'expérience
    const experience = await Experience.create({
      title,
      company,
      location,
      startDate,
      endDate: current ? null : endDate,
      current,
      description
    });
    
    return res.status(201).json({
      success: true,
      message: 'Expérience créée avec succès',
      data: experience
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'expérience:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'expérience',
      error: error.message
    });
  }
};

/**
 * Mettre à jour une expérience
 */
exports.updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, location, startDate, endDate, current, description } = req.body;
    
    // Vérifier si l'expérience existe
    const experience = await Experience.findByPk(id);
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Expérience non trouvée'
      });
    }
    
    // Mettre à jour l'expérience
    await experience.update({
      title: title || experience.title,
      company: company || experience.company,
      location: location !== undefined ? location : experience.location,
      startDate: startDate || experience.startDate,
      endDate: current ? null : (endDate || experience.endDate),
      current: current !== undefined ? current : experience.current,
      description: description !== undefined ? description : experience.description
    });
    
    return res.status(200).json({
      success: true,
      message: 'Expérience mise à jour avec succès',
      data: experience
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'expérience:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'expérience',
      error: error.message
    });
  }
};

/**
 * Supprimer une expérience
 */
exports.deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si l'expérience existe
    const experience = await Experience.findByPk(id);
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Expérience non trouvée'
      });
    }
    
    // Supprimer l'expérience
    await experience.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Expérience supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'expérience:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'expérience',
      error: error.message
    });
  }
};
