const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Utilitaire pour l'envoi d'emails
 */
class EmailService {
  constructor() {
    // Créer le transporteur seulement si les variables d'environnement sont définies
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
  }

  /**
   * Envoyer un email de notification pour un nouveau message de contact
   * @param {Object} message - Le message de contact
   * @returns {Promise} - Résultat de l'envoi
   */
  async sendContactNotification(message) {
    if (!this.transporter) {
      console.log('Configuration email non disponible, notification non envoyée');
      return null;
    }

    try {
      const result = await this.transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `Nouveau message de contact de ${message.name}`,
        text: `Vous avez reçu un nouveau message de ${message.name} (${message.email}):\n\n${message.message}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom:</strong> ${message.name}</p>
          <p><strong>Email:</strong> ${message.email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.message.replace(/\n/g, '<br>')}</p>
        `
      });

      return result;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return null;
    }
  }
}

module.exports = new EmailService();
