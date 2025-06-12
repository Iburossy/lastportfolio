const { Project } = require('../models');
const fs = require('fs');
const path = require('path');

/**
 * Récupérer tous les projets
 */
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['created_at', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Projets récupérés avec succès',
      data: projects
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des projets',
      error: error.message
    });
  }
};

/**
 * Récupérer un projet par son ID
 */
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findByPk(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Projet récupéré avec succès',
      data: project
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du projet',
      error: error.message
    });
  }
};

/**
 * Créer un nouveau projet
 */
exports.createProject = async (req, res) => {
  try {
    console.log('=== DÉBUT CRÉATION PROJET ===');
    console.log('Body reçu:', req.body);
    console.log('Files reçus:', req.files ? req.files.length : 'aucun');
    
    const { title, description, github_link, live_link, youtube_link } = req.body;
    
    console.log('Données extraites:', { title, description, github_link, live_link, youtube_link });
    
    // Gérer les technologies (peuvent être envoyées comme technologies[] dans formData)
    let technologiesArray = [];
    if (req.body['technologies[]']) {
      // Si c'est un tableau envoyé via FormData
      technologiesArray = Array.isArray(req.body['technologies[]']) 
        ? req.body['technologies[]'] 
        : [req.body['technologies[]']];
      console.log('Technologies[] trouvées:', technologiesArray);
    } else if (req.body.technologies) {
      // Si c'est une chaîne JSON
      try {
        technologiesArray = JSON.parse(req.body.technologies);
        console.log('Technologies JSON parsées:', technologiesArray);
      } catch (err) {
        // Si ce n'est pas du JSON valide, on considère que c'est une simple chaîne
        technologiesArray = [req.body.technologies];
        console.log('Technologies comme chaîne simple:', technologiesArray);
        console.log('Erreur de parsing JSON:', err.message);
      }
    } else {
      console.log('Aucune technologie trouvée dans la requête');
    }
    
    // Gérer les images uploadées
    let image_urls = [];
    
    if (req.files && req.files.length > 0) {
      image_urls = req.files.map(file => `/uploads/${file.filename}`);
      console.log('Images uploadées:', image_urls);
    } else if (req.file) {
      image_urls = [`/uploads/${req.file.filename}`];
      console.log('Image unique uploadée:', image_urls);
    } else {
      console.log('Aucune image uploadée');
    }
    
    // Créer le projet
    console.log('Données à sauvegarder dans la BDD:', {
      title,
      description,
      technologies: technologiesArray,
      github_link,
      live_link,
      youtube_link,
      image_urls
    });
    
    const project = await Project.create({
      title,
      description,
      technologies: technologiesArray,
      github_link,
      live_link,
      youtube_link,
      image_urls
    });
    
    console.log('Projet créé avec succès, ID:', project.id);
    console.log('Projet créé:', JSON.stringify(project, null, 2));
    console.log('=== FIN CRÉATION PROJET ===');
    
    return res.status(201).json({
      success: true,
      message: 'Projet créé avec succès',
      data: project
    });
  } catch (error) {
    console.log('=== ERREUR CRÉATION PROJET ===');
    console.log('Message d\'erreur:', error.message);
    console.log('Stack trace:', error.stack);
    console.log('=== FIN ERREUR ===');
    
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du projet',
      error: error.message
    });
  }
};

/**
 * Mettre à jour un projet existant
 */
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, github_link, live_link, youtube_link } = req.body;
    
    // Vérifier si le projet existe
    const project = await Project.findByPk(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    // Gérer les technologies (peuvent être envoyées comme technologies[] dans formData)
    let technologiesArray = [];
    if (req.body['technologies[]']) {
      // Si c'est un tableau envoyé via FormData
      technologiesArray = Array.isArray(req.body['technologies[]']) 
        ? req.body['technologies[]'] 
        : [req.body['technologies[]']];
    } else if (req.body.technologies) {
      // Si c'est une chaîne JSON
      try {
        technologiesArray = JSON.parse(req.body.technologies);
      } catch {
        // Si ce n'est pas du JSON valide, on considère que c'est une simple chaîne
        technologiesArray = [req.body.technologies];
      }
    }
    
    // Gérer les images uploadées
    let image_urls = project.image_urls || [];
    
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      image_urls = [...image_urls, ...newImages];
    } else if (req.file) {
      image_urls = [...image_urls, `/uploads/${req.file.filename}`];
    }
    
    // Gérer les images existantes (envoyées via existingImages[])
    if (req.body['existingImages[]']) {
      const existingImages = Array.isArray(req.body['existingImages[]']) 
        ? req.body['existingImages[]'] 
        : [req.body['existingImages[]']];
      image_urls = existingImages;
    } else if (req.body.image_urls) {
      try {
        image_urls = JSON.parse(req.body.image_urls);
      } catch {
        // Si ce n'est pas du JSON valide, on ignore
      }
    }
    
    // Mettre à jour le projet
    await project.update({
      title,
      description,
      technologies: technologiesArray,
      github_link,
      live_link,
      youtube_link,
      image_urls
    });
    
    return res.status(200).json({
      success: true,
      message: 'Projet mis à jour avec succès',
      data: project
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du projet',
      error: error.message
    });
  }
};

/**
 * Supprimer un projet
 */
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si le projet existe
    const project = await Project.findByPk(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    // Supprimer les images associées au projet
    const images = project.image_urls || [];
    
    images.forEach(imageUrl => {
      const imagePath = path.join(__dirname, '..', imageUrl);
      
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
    
    // Supprimer le projet
    await project.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Projet supprimé avec succès'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du projet',
      error: error.message
    });
  }
};

/**
 * Supprimer une image spécifique d'un projet
 */
exports.deleteProjectImage = async (req, res) => {
  try {
    const { id, imageIndex } = req.params;
    
    // Vérifier si le projet existe
    const project = await Project.findByPk(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    // Récupérer les images actuelles
    const images = project.image_urls || [];
    
    if (imageIndex < 0 || imageIndex >= images.length) {
      return res.status(400).json({
        success: false,
        message: 'Index d\'image invalide'
      });
    }
    
    // Supprimer l'image du système de fichiers
    const imageUrl = images[imageIndex];
    const imagePath = path.join(__dirname, '..', imageUrl);
    
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    // Supprimer l'image de la liste
    images.splice(imageIndex, 1);
    
    // Mettre à jour le projet
    await project.update({
      image_urls: images
    });
    
    return res.status(200).json({
      success: true,
      message: 'Image supprimée avec succès',
      data: project
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'image',
      error: error.message
    });
  }
};
