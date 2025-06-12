import api from './api';

const authService = {
  // Connexion à l'espace d'administration
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Stocker le token JWT dans le localStorage
      if (response.data.data && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.data.id,
          username: response.data.data.username
        }));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Vérifier si le token est valide
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      // En cas d'erreur, supprimer le token et l'utilisateur
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  // Déconnexion (côté client)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Récupérer les informations de l'utilisateur connecté
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
