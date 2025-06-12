const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Récupérer tous les projets (public)
router.get('/', projectController.getAllProjects);

// Récupérer un projet par son ID (public)
router.get('/:id', projectController.getProjectById);

// Créer un nouveau projet (protégé, admin uniquement)
router.post('/', verifyToken, upload.uploadMultipleImages, projectController.createProject);

// Mettre à jour un projet existant (protégé, admin uniquement)
router.put('/:id', verifyToken, upload.uploadMultipleImages, projectController.updateProject);

// Supprimer un projet (protégé, admin uniquement)
router.delete('/:id', verifyToken, projectController.deleteProject);

// Supprimer une image spécifique d'un projet (protégé, admin uniquement)
router.delete('/:projectId/images/:imageIndex', verifyToken, projectController.deleteProjectImage);

module.exports = router;
