const express = require('express');
const router = express.Router();
const contactInfoController = require('../controllers/contactInfo.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Route publique pour récupérer les informations de contact
router.get('/', contactInfoController.getContactInfo);

// Route protégée pour mettre à jour les informations de contact
router.put('/', authMiddleware.verifyToken, contactInfoController.updateContactInfo);

module.exports = router;
