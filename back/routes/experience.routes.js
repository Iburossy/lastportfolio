const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experience.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Routes publiques (accessibles sans authentification)
router.get('/', experienceController.getAllExperiences);
router.get('/:id', experienceController.getExperienceById);

// Routes protégées (nécessitent une authentification)
router.post('/', verifyToken, experienceController.createExperience);
router.put('/:id', verifyToken, experienceController.updateExperience);
router.delete('/:id', verifyToken, experienceController.deleteExperience);

module.exports = router;
