const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Routes protégées pour la gestion des messages
router.get('/', verifyToken, contactController.getAllMessages);
router.delete('/:id', verifyToken, contactController.deleteMessage);

module.exports = router;
