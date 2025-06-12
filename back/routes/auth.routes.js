const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateLogin } = require('../middlewares/validation.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');

// Route de connexion
router.post('/login', validateLogin, authController.login);

// Route pour vérifier si un token est valide
router.get('/verify', verifyToken, authController.verifyToken);

module.exports = router;
