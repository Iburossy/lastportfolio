const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { validateProject } = require('../middlewares/validation.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');
const { uploadMultipleImages } = require('../middlewares/upload.middleware');

// Routes publiques
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

// Routes protégées (nécessitent authentification)
router.post('/', verifyToken, uploadMultipleImages, validateProject, projectController.createProject);
router.put('/:id', verifyToken, uploadMultipleImages, validateProject, projectController.updateProject);
router.delete('/:id', verifyToken, projectController.deleteProject);
router.delete('/:id/image/:imageIndex', verifyToken, projectController.deleteProjectImage);

module.exports = router;
