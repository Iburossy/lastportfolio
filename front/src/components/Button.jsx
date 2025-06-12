import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Style de base pour les boutons
const ButtonStyles = css`
  display: inline-block;
  padding: ${({ $small }) => ($small ? '0.5rem 1rem' : '0.75rem 1.5rem')};
  font-size: ${({ $small }) => ($small ? '0.9rem' : '1rem')};
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  transition: var(--transition);
  background-color: ${({ variant }) => 
    variant === 'primary' 
      ? 'var(--primary)' 
      : variant === 'secondary' 
        ? 'var(--secondary)' 
        : variant === 'success' 
          ? 'var(--success)' 
          : variant === 'danger' 
            ? 'var(--error)' 
            : variant === 'outline' 
              ? 'transparent' 
              : 'var(--primary)'};
  color: ${({ variant }) => 
    variant === 'outline' ? 'var(--primary)' : 'white'};
  border: ${({ variant }) => 
    variant === 'outline' ? '1px solid var(--primary)' : 'none'};
  
  &:hover, &:focus {
    background-color: ${({ variant }) => 
      variant === 'primary' 
        ? 'var(--primary-dark)' 
        : variant === 'secondary' 
          ? '#5a6268' 
          : variant === 'success' 
            ? '#218838' 
            : variant === 'danger' 
              ? '#c82333' 
              : variant === 'outline' 
                ? 'rgba(0, 112, 243, 0.1)' 
                : 'var(--primary-dark)'};
    box-shadow: ${({ variant }) => 
      variant === 'outline' ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
  
  ${({ $fullWidth }) => $fullWidth && css`
    width: 100%;
    display: block;
  `}
`;

// Composant pour les boutons normaux
const StyledButton = styled(motion.button)`
  ${ButtonStyles}
`;

// Composant pour les boutons avec lien interne (React Router)
const StyledLinkButton = styled(motion(Link))`
  ${ButtonStyles}
`;

// Composant pour les liens externes
const StyledAnchorButton = styled(motion.a)`
  ${ButtonStyles}
`;

const Button = ({ 
  children, 
  to, 
  href, 
  variant = 'primary',
  $small = false,
  $fullWidth = false,
  ...props 
}) => {
  // Si 'to' est fourni, renvoyer un lien React Router
  if (to) {
    return (
      <StyledLinkButton 
        to={to} 
        variant={variant}
        $small={$small}
        $fullWidth={$fullWidth}
        {...props}
      >
        {children}
      </StyledLinkButton>
    );
  }
  
  // Si 'href' est fourni, renvoyer un lien externe
  if (href) {
    return (
      <StyledAnchorButton 
        href={href} 
        variant={variant}
        $small={$small}
        $fullWidth={$fullWidth}
        target="_blank" 
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </StyledAnchorButton>
    );
  }
  
  // Sinon, renvoyer un bouton standard
  return (
    <StyledButton 
      variant={variant}
      $small={$small}
      $fullWidth={$fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
