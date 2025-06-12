import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from 'react-icons/fa';

// Animation d'entrée
const slideIn = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Animation de sortie
const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-20px);
    opacity: 0;
  }
`;

const AlertContainer = styled.div`
  position: ${props => props.fixed ? 'fixed' : 'relative'};
  top: ${props => props.fixed ? '20px' : 'auto'};
  left: ${props => props.fixed ? '50%' : 'auto'};
  transform: ${props => props.fixed ? 'translateX(-50%)' : 'none'};
  z-index: ${props => props.fixed ? '1050' : '1'};
  width: ${props => props.fixed ? 'auto' : '100%'};
  max-width: ${props => props.fixed ? '500px' : 'none'};
  min-width: ${props => props.fixed ? '300px' : 'none'};
  margin-bottom: ${props => props.fixed ? '0' : '1rem'};
  display: ${props => props.visible ? 'flex' : 'none'};
  animation: ${props => props.visible 
    ? css`${slideIn} 0.3s ease forwards` 
    : css`${slideOut} 0.3s ease forwards`
  };
`;

const Alert = styled.div`
  width: 100%;
  padding: 1rem;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  ${props => {
    switch(props.type) {
      case 'success':
        return css`
          background-color: var(--success);
          border-left: 4px solid #1e7e34;
        `;
      case 'info':
        return css`
          background-color: #17a2b8;
          border-left: 4px solid #117a8b;
        `;
      case 'warning':
        return css`
          background-color: #ffc107;
          border-left: 4px solid #d39e00;
          color: #212529;
        `;
      case 'error':
        return css`
          background-color: var(--error);
          border-left: 4px solid #bd2130;
        `;
      default:
        return css`
          background-color: var(--primary);
          border-left: 4px solid var(--primary-dark);
        `;
    }
  }}
`;

const IconWrapper = styled.div`
  margin-right: 0.75rem;
  font-size: 1.25rem;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: ${props => props.hasDescription ? '0.25rem' : '0'};
`;

const Description = styled.p`
  font-size: 0.875rem;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const AlertComponent = ({
  type = 'info',
  title,
  message,
  autoClose = true,
  duration = 5000,
  onClose,
  fixed = false,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        
        const animationTimer = setTimeout(() => {
          if (onClose) onClose();
        }, 300); // Attendre que l'animation de sortie se termine
        
        return () => clearTimeout(animationTimer);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Attendre que l'animation de sortie se termine
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'info':
        return <FaInfoCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'error':
        return <FaTimesCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    <AlertContainer visible={visible} fixed={fixed}>
      <Alert type={type}>
        <IconWrapper>{getIcon()}</IconWrapper>
        <Content>
          {title && <Title hasDescription={!!message}>{title}</Title>}
          {message && <Description>{message}</Description>}
        </Content>
        <CloseButton onClick={handleClose} aria-label="Close">
          <FaTimes />
        </CloseButton>
      </Alert>
    </AlertContainer>
  );
};

export default AlertComponent;
