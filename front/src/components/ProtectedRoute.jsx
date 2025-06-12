import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import Loader from './Loader';

/**
 * Composant qui protège les routes administratives
 * Vérifie si l'utilisateur est authentifié, sinon redirige vers la page de connexion
 */
const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifie si un token existe et est valide
        if (authService.isAuthenticated()) {
          // Vérifie la validité du token auprès du serveur
          await authService.verifyToken();
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <Loader fullScreen text="Vérification de l'authentification..." />;
  }

  if (!isAuthenticated) {
    // Redirige vers la page de connexion en conservant l'URL d'origine
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // L'utilisateur est authentifié, affiche le composant enfant
  return children;
};

export default ProtectedRoute;
