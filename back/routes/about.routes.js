const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const aboutController = require('../controllers/about.controller');
const { validateAbout } = require('../middlewares/validation.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'photo-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Seules les images (jpeg, jpg, png, gif) sont autorisées'));
  }
});

// Route publique pour récupérer les informations
router.get('/', aboutController.getAbout);

// Route protégée pour mettre à jour les informations avec upload de photo
router.put('/', verifyToken, upload.single('photo'), validateAbout, aboutController.updateAbout);

module.exports = router;
