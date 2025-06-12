import api from './api';

const contactInfoService = {
  // Récupérer les informations de contact
  getContactInfo: async () => {
    try {
      const response = await api.get('/contact-info');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour les informations de contact (protégé)
  updateContactInfo: async (contactData) => {
    try {
      const response = await api.put('/contact-info', contactData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default contactInfoService;
