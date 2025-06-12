const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { validateContact } = require('../middlewares/validation.middleware');

// Route pour envoyer un message de contact
router.post('/', validateContact, contactController.sendMessage);

module.exports = router;
