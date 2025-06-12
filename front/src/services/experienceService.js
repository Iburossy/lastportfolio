import api from './api';

const experienceService = {
  /**
   * Récupérer toutes les expériences professionnelles
   */
  getAllExperiences: async () => {
    try {
      const response = await api.get('/experiences');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des expériences:', error);
      throw error;
    }
  },

  /**
   * Récupérer une expérience par son ID
   */
  getExperienceById: async (id) => {
    try {
      const response = await api.get(`/experiences/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'expérience ${id}:`, error);
      throw error;
    }
  },

  /**
   * Créer une nouvelle expérience
   */
  createExperience: async (experienceData) => {
    try {
      const response = await api.post('/experiences', experienceData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'expérience:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour une expérience existante
   */
  updateExperience: async (id, experienceData) => {
    try {
      const response = await api.put(`/experiences/${id}`, experienceData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'expérience ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprimer une expérience
   */
  deleteExperience: async (id) => {
    try {
      const response = await api.delete(`/experiences/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'expérience ${id}:`, error);
      throw error;
    }
  }
};

export default experienceService;
