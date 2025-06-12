const { Contact } = require('../models');

/**
 * Récupérer les informations de contact
 */
exports.getContactInfo = async (req, res) => {
  try {
    // Récupérer ou créer une entrée de contact
    let contactInfo = await Contact.findOne();
    
    if (!contactInfo) {
      // Créer une entrée par défaut si elle n'existe pas
      contactInfo = await Contact.create({
        email: 'contact@example.com',
        phone: '+33 6 12 34 56 78',
        address: 'Paris, France',
        linkedin: 'https://linkedin.com/in/username',
        github: 'https://github.com/username',
        twitter: '',
        facebook: '',
        instagram: ''
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Informations de contact récupérées avec succès',
      data: contactInfo
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des informations de contact',
      error: error.message
    });
  }
};

/**
 * Mettre à jour les informations de contact
 */
exports.updateContactInfo = async (req, res) => {
  try {
    const { email, phone, address, linkedin, github, twitter, facebook, instagram } = req.body;
    
    // Récupérer ou créer une entrée de contact
    let contactInfo = await Contact.findOne();
    
    if (!contactInfo) {
      contactInfo = await Contact.create({
        email,
        phone,
        address,
        linkedin,
        github,
        twitter,
        facebook,
        instagram
      });
    } else {
      // Mettre à jour les champs
      await contactInfo.update({
        email: email || contactInfo.email,
        phone: phone || contactInfo.phone,
        address: address || contactInfo.address,
        linkedin: linkedin || contactInfo.linkedin,
        github: github || contactInfo.github,
        twitter: twitter || contactInfo.twitter,
        facebook: facebook || contactInfo.facebook,
        instagram: instagram || contactInfo.instagram
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Informations de contact mises à jour avec succès',
      data: contactInfo
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des informations de contact',
      error: error.message
    });
  }
};
