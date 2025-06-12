const express = require('express');
const router = express.Router();
const introController = require('../controllers/intro.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Route publique pour récupérer les informations d'introduction
router.get('/', introController.getIntro);

// Route protégée pour mettre à jour les informations d'introduction
router.put('/', authMiddleware.verifyToken, introController.updateIntro);

module.exports = router;
