import api from './api';

const projectService = {
  // Récupérer tous les projets
  getAllProjects: async () => {
    try {
      console.log('=== DÉBUT RÉCUPÉRATION TOUS LES PROJETS ===');
      const response = await api.get('/projects');
      console.log('Projets récupérés:', response.data);
      
      // Vérifier si les données sont correctement formatées
      if (response.data && response.data.data) {
        response.data.data.forEach((project, index) => {
          console.log(`Projet ${index + 1}:`, project);
          console.log(`- title: ${project.title}`);
          console.log(`- description: ${project.description ? project.description.substring(0, 50) + '...' : 'undefined'}`);
          console.log(`- technologies:`, project.technologies);
          console.log(`- image_urls:`, project.image_urls);
        });
      }
      
      console.log('=== FIN RÉCUPÉRATION TOUS LES PROJETS ===');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      throw error;
    }
  },

  // Récupérer un projet par son ID
  getProjectById: async (id) => {
    try {
      console.log(`Récupération du projet avec ID: ${id}`);
      const response = await api.get(`/projects/${id}`);
      console.log('Projet récupéré:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du projet ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouveau projet (protégé)
  createProject: async (formData) => {
    try {
      console.log('=== DÉBUT ENVOI PROJET (FRONTEND) ===');
      console.log('FormData reçu dans createProject');
      
      // Log du contenu du FormData (pour débogage)
      console.log('Contenu du FormData:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      
      const response = await api.post('/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Réponse du serveur:', response.data);
      console.log('=== FIN ENVOI PROJET (FRONTEND) ===');
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un projet existant (protégé)
  updateProject: async (id, formData) => {
    try {
      console.log(`=== DÉBUT MISE À JOUR PROJET ${id} (FRONTEND) ===`);
      
      // Log du contenu du FormData (pour débogage)
      console.log('Contenu du FormData pour mise à jour:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      
      const response = await api.put(`/projects/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Réponse du serveur après mise à jour:', response.data);
      console.log(`=== FIN MISE À JOUR PROJET ${id} (FRONTEND) ===`);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un projet (protégé)
  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une image d'un projet (protégé)
  deleteProjectImage: async (projectId, imageIndex) => {
    try {
      const response = await api.delete(`/projects/${projectId}/image/${imageIndex}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default projectService;
