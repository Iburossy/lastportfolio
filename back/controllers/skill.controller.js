const Skill = require('../models/skill.model');

/**
 * Récupérer toutes les compétences
 */
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll({
      order: [
        ['category', 'ASC'],
        ['order', 'ASC'],
        ['name', 'ASC']
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des compétences',
      error: error.message
    });
  }
};

/**
 * Récupérer une compétence par son ID
 */
exports.getSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const skill = await Skill.findByPk(id);
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Compétence non trouvée'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la compétence:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la compétence',
      error: error.message
    });
  }
};

/**
 * Créer une nouvelle compétence
 */
exports.createSkill = async (req, res) => {
  try {
    const { name, category, level, order } = req.body;
    
    // Validation basique
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Le nom et la catégorie sont requis'
      });
    }
    
    // Créer la compétence
    const skill = await Skill.create({
      name,
      category,
      level: level || 80,
      order: order || 0
    });
    
    return res.status(201).json({
      success: true,
      message: 'Compétence créée avec succès',
      data: skill
    });
  } catch (error) {
    console.error('Erreur lors de la création de la compétence:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la compétence',
      error: error.message
    });
  }
};

/**
 * Mettre à jour une compétence
 */
exports.updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, level, order } = req.body;
    
    // Vérifier si la compétence existe
    const skill = await Skill.findByPk(id);
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Compétence non trouvée'
      });
    }
    
    // Mettre à jour la compétence
    await skill.update({
      name: name || skill.name,
      category: category || skill.category,
      level: level !== undefined ? level : skill.level,
      order: order !== undefined ? order : skill.order
    });
    
    return res.status(200).json({
      success: true,
      message: 'Compétence mise à jour avec succès',
      data: skill
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la compétence:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la compétence',
      error: error.message
    });
  }
};

/**
 * Supprimer une compétence
 */
exports.deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si la compétence existe
    const skill = await Skill.findByPk(id);
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Compétence non trouvée'
      });
    }
    
    // Supprimer la compétence
    await skill.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Compétence supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la compétence:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la compétence',
      error: error.message
    });
  }
};

/**
 * Récupérer toutes les catégories de compétences
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Skill.findAll({
      attributes: ['category'],
      group: ['category'],
      order: [['category', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories.map(item => item.category)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories',
      error: error.message
    });
  }
};
