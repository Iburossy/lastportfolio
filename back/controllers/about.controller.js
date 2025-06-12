const { About } = require('../models');

/**
 * Récupérer les informations de la section About
 */
exports.getAbout = async (req, res) => {
  try {
    // Récupérer ou créer une entrée About
    let about = await About.findOne();
    
    if (!about) {
      // Créer une entrée par défaut si elle n'existe pas
      about = await About.create({
        fullName: 'Non spécifié',
        title: 'Développeur Fullstack',
        specialties: ['Web & Mobile'],
        content: 'Bienvenue sur mon portfolio. Modifiez cette section pour vous présenter.',
        skills: [
          { name: 'HTML/CSS', level: 90 },
          { name: 'JavaScript', level: 85 },
          { name: 'React', level: 80 },
          { name: 'Node.js', level: 75 }
        ]
      });
    }
    
    // Formater les données pour le frontend
    const formattedData = {
      fullName: about.fullName || 'Non spécifié',
      title: about.title || 'Développeur Fullstack',
      specialties: about.specialties || ['Web & Mobile'],
      bio: about.content,
      skills: about.skills,
      photo_url: about.photo_url
    };
    
    console.log('Données envoyées au frontend:', formattedData);
    
    return res.status(200).json({
      success: true,
      message: 'Informations récupérées avec succès',
      data: formattedData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des informations',
      error: error.message
    });
  }
};

/**
 * Mettre à jour les informations de la section About
 */
exports.updateAbout = async (req, res) => {
  try {
    console.log('Début de la mise à jour du profil');
    console.log('Body reçu:', req.body);
    console.log('Files reçus:', req.file ? req.file.filename : 'aucun');
    
    const { content, skills, fullName, title, specialties } = req.body;
    let photo_url = null;
    
    // Gérer le téléchargement de la photo si présente
    if (req.file) {
      photo_url = `/uploads/${req.file.filename}`;
      console.log('Photo téléchargée:', photo_url);
    }
    
    // Récupérer ou créer une entrée About
    let about = await About.findOne();
    
    const updateData = {
      content,
      skills
    };
    
    // Ajouter les champs supplémentaires s'ils sont présents
    if (fullName) updateData.fullName = fullName;
    if (title) updateData.title = title;
    if (specialties) {
      // Convertir la chaîne en tableau si nécessaire
      if (typeof specialties === 'string') {
        updateData.specialties = specialties
          .split(',')
          .map(s => s.trim())
          .filter(s => s);
      } else {
        updateData.specialties = specialties;
      }
    }
    
    // Ajouter l'URL de la photo seulement si une nouvelle photo a été téléchargée
    if (photo_url) {
      updateData.photo_url = photo_url;
    }
    
    if (!about) {
      // Créer une nouvelle entrée
      about = await About.create(updateData);
      console.log('Nouvelle entrée About créée');
    } else {
      // Mettre à jour l'entrée existante
      await about.update(updateData);
      console.log('Entrée About mise à jour');
    }
    
    return res.status(200).json({
      success: true,
      message: 'Informations mises à jour avec succès',
      data: about
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des informations',
      error: error.message
    });
  }
};
