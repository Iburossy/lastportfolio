const { Intro } = require('../models');

/**
 * Récupérer les informations d'introduction
 */
exports.getIntro = async (req, res) => {
  try {
    // Récupérer ou créer une entrée d'introduction
    let introInfo = await Intro.findOne();
    
    if (!introInfo) {
      // Créer une entrée par défaut si elle n'existe pas
      introInfo = await Intro.create({
        title: "Bienvenue sur mon Portfolio",
        subtitle: "Développeur Fullstack passionné par la création d'applications web modernes et performantes.",
        description: "",
        button_text: "En savoir plus",
        button_link: "/about"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Informations d\'introduction récupérées avec succès',
      data: introInfo
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des informations d\'introduction:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des informations d\'introduction',
      error: error.message
    });
  }
};

/**
 * Mettre à jour les informations d'introduction
 */
exports.updateIntro = async (req, res) => {
  try {
    const { title, subtitle, description, button_text, button_link } = req.body;
    
    // Récupérer ou créer une entrée d'introduction
    let introInfo = await Intro.findOne();
    
    if (!introInfo) {
      introInfo = await Intro.create({
        title,
        subtitle,
        description,
        button_text,
        button_link
      });
    } else {
      // Mettre à jour les champs
      await introInfo.update({
        title: title || introInfo.title,
        subtitle: subtitle || introInfo.subtitle,
        description: description !== undefined ? description : introInfo.description,
        button_text: button_text !== undefined ? button_text : introInfo.button_text,
        button_link: button_link !== undefined ? button_link : introInfo.button_link
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Informations d\'introduction mises à jour avec succès',
      data: introInfo
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations d\'introduction:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des informations d\'introduction',
      error: error.message
    });
  }
};
