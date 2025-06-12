import api from './api';

const contactService = {
  // Envoyer un message de contact
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/contact', messageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer tous les messages (protégé)
  getAllMessages: async () => {
    try {
      const response = await api.get('/messages');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un message (protégé)
  deleteMessage: async (id) => {
    try {
      const response = await api.delete(`/messages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default contactService;
