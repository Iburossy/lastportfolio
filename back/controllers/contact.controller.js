const { Message } = require('../models');
const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Envoyer un message de contact
 */
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Créer un nouveau message dans la base de données
    const newMessage = await Message.create({
      name,
      email,
      message
    });
    
    // Configurer le transporteur d'emails (si les variables d'environnement sont définies)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: process.env.EMAIL_PORT || 587,
          secure: process.env.EMAIL_PORT === '465',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        
        // Envoyer un email de notification
        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          subject: `Nouveau message de contact de ${name}`,
          text: `Vous avez reçu un nouveau message de ${name} (${email}):\n\n${message}`,
          html: `
            <h2>Nouveau message de contact</h2>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        });
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
        // On continue même si l'email n'a pas pu être envoyé
      }
    }
    
    return res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      data: newMessage
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message',
      error: error.message
    });
  }
};

/**
 * Récupérer tous les messages
 */
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [['sent_at', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Messages récupérés avec succès',
      data: messages
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages',
      error: error.message
    });
  }
};

/**
 * Supprimer un message
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si le message existe
    const message = await Message.findByPk(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }
    
    // Supprimer le message
    await message.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Message supprimé avec succès'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du message',
      error: error.message
    });
  }
};
