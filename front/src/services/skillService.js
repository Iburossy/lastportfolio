import api from './api';

/**
 * Service pour gérer les compétences
 */
const skillService = {
  /**
   * Récupérer toutes les compétences
   */
  getAllSkills: async () => {
    try {
      const response = await api.get('/skills');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des compétences:', error);
      throw error;
    }
  },

  /**
   * Récupérer une compétence par son ID
   */
  getSkillById: async (id) => {
    try {
      const response = await api.get(`/skills/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la compétence ${id}:`, error);
      throw error;
    }
  },

  /**
   * Créer une nouvelle compétence
   */
  createSkill: async (skillData) => {
    try {
      const response = await api.post('/skills', skillData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la compétence:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour une compétence
   */
  updateSkill: async (id, skillData) => {
    try {
      const response = await api.put(`/skills/${id}`, skillData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la compétence ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprimer une compétence
   */
  deleteSkill: async (id) => {
    try {
      const response = await api.delete(`/skills/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la compétence ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupérer toutes les catégories de compétences
   */
  getAllCategories: async () => {
    try {
      const response = await api.get('/skills/categories');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  }
};

export default skillService;
