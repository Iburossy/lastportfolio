import api from './api';

const aboutService = {
  // Récupérer les informations de la section "About"
  getAbout: async () => {
    try {
      const response = await api.get('/about');
      console.log('Réponse brute du backend:', response);
      // Retourner directement les données formatées pour simplifier l'accès dans le composant
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour les informations de la section "About" (protégé)
  updateAbout: async (formData) => {
    try {
      // Utiliser des en-têtes spécifiques pour FormData
      const response = await api.put('/about', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Réponse du serveur:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur dans le service aboutService.updateAbout:', error);
      throw error;
    }
  }
};

export default aboutService;
