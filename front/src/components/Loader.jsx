import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animation de rotation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Animation de pulsation
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// Conteneur principal centré
const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${props => props.fullScreen ? '0' : '2rem'};
  height: ${props => props.fullScreen ? '100vh' : 'auto'};
`;

// Spinner circulaire
const SpinnerLoader = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 3px solid rgba(0, 112, 243, 0.2);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

// Texte sous le spinner
const LoadingText = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const Loader = ({ 
  text = "Chargement en cours...", 
  size,
  fullScreen = false 
}) => {
  return (
    <LoaderContainer fullScreen={fullScreen}>
      <SpinnerLoader size={size} />
      {text && <LoadingText>{text}</LoadingText>}
    </LoaderContainer>
  );
};

export default Loader;
