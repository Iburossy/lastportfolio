import api from './api';

/**
 * Service pour gérer les opérations liées à l'introduction
 */
const introService = {
  /**
   * Récupérer les informations d'introduction
   * @returns {Promise} Promesse avec les données de l'introduction
   */
  getIntro: async () => {
    try {
      const response = await api.get('/intro');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations d\'introduction:', error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Mettre à jour les informations d'introduction
   * @param {Object} introData - Données d'introduction à mettre à jour
   * @returns {Promise} Promesse avec les données mises à jour
   */
  updateIntro: async (introData) => {
    try {
      const response = await api.put('/intro', introData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations d\'introduction:', error);
      return { success: false, message: error.message };
    }
  }
};

export default introService;
