const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Routes publiques (accessibles sans authentification)
router.get('/', skillController.getAllSkills);
router.get('/categories', skillController.getAllCategories);
router.get('/:id', skillController.getSkillById);

// Routes protégées (nécessitent une authentification)
router.post('/', verifyToken, skillController.createSkill);
router.put('/:id', verifyToken, skillController.updateSkill);
router.delete('/:id', verifyToken, skillController.deleteSkill);

module.exports = router;
