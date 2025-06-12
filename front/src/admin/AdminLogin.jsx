import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaLock, FaUser, FaSignInAlt } from 'react-icons/fa';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import authService from '../services/authService';

// Styles
const LoginContainer = styled.div`
  max-width: 480px;
  margin: 3rem auto;
  padding: 0 1.5rem;
`;

const LoginCard = styled(motion.div)`
  background-color: var(--paper);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LoginTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
`;

const LoginSubtitle = styled.p`
  color: var(--text-secondary);
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: var(--text-secondary);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid ${props => props.error ? 'var(--error)' : '#e1e1e1'};
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: 1rem;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const ErrorMessage = styled.p`
  color: var(--error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SubmitButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();
  
  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Vérifie la validité du token auprès du serveur
          await authService.verifyToken();
          navigate('/admin');
        }
      } catch (error) {
        // Token invalide, supprimer le token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      await authService.login(data);
      
      // Redirection vers la page d'origine ou le dashboard
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      setAlert({
        type: 'error',
        title: 'Erreur de connexion',
        message: 'Identifiants incorrects. Veuillez réessayer.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAlertClose = () => {
    setAlert(null);
  };
  
  return (
    <LoginContainer>
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={handleAlertClose}
          autoClose={true}
        />
      )}
      
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginHeader>
          <LoginTitle>Connexion Admin</LoginTitle>
          <LoginSubtitle>
            Connectez-vous pour accéder à l'espace d'administration
          </LoginSubtitle>
        </LoginHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField>
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <InputWrapper>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input
                id="username"
                type="text"
                error={errors.username}
                {...register('username', { 
                  required: 'Le nom d\'utilisateur est requis' 
                })}
                disabled={isSubmitting}
                placeholder="Entrez votre nom d'utilisateur"
              />
            </InputWrapper>
            {errors.username && (
              <ErrorMessage>{errors.username.message}</ErrorMessage>
            )}
          </FormField>
          
          <FormField>
            <Label htmlFor="password">Mot de passe</Label>
            <InputWrapper>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                id="password"
                type="password"
                error={errors.password}
                {...register('password', { 
                  required: 'Le mot de passe est requis' 
                })}
                disabled={isSubmitting}
                placeholder="Entrez votre mot de passe"
              />
            </InputWrapper>
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </FormField>
          
          <SubmitButton 
            type="submit" 
            $fullWidth 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader size="20px" />
                Connexion en cours...
              </>
            ) : (
              <>
                <FaSignInAlt />
                Se connecter
              </>
            )}
          </SubmitButton>
        </form>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLogin;
