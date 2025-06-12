import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaTrash, FaEnvelope, FaUser, FaClock } from 'react-icons/fa';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import contactService from '../services/contactService';

// Styles
const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    color: var(--primary);
  }
`;

const MessagesWrapper = styled.div`
  margin-top: 1rem;
`;

const MessageCard = styled(motion.div)`
  background-color: var(--paper);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SenderName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SenderEmail = styled.a`
  color: var(--primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const MessageDate = styled.span`
  color: var(--text-secondary);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionsContainer = styled.div``;

const DeleteButton = styled.button`
  background-color: rgba(220, 53, 69, 0.1);
  color: var(--error);
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: rgba(220, 53, 69, 0.2);
  }
`;

const MessageContent = styled.div`
  padding-top: 1rem;
  border-top: 1px solid #e1e1e1;
  color: var(--text-primary);
  line-height: 1.6;
`;

const NoMessages = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: var(--text-secondary);
`;

const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--paper);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
  max-width: 500px;
  width: 90%;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
`;

const ModalText = styled.p`
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  
  &.cancel {
    background: none;
    border: 1px solid #e1e1e1;
    color: var(--text-secondary);
    
    &:hover {
      background-color: #f8f9fa;
    }
  }
  
  &.delete {
    background-color: var(--error);
    border: none;
    color: white;
    
    &:hover {
      background-color: #c82333;
    }
  }
`;

const MessagesPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  
  useEffect(() => {
    fetchMessages();
  }, []);
  
  const fetchMessages = async () => {
    try {
      const response = await contactService.getAllMessages();
      setMessages(response.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des messages:', err);
      setError('Impossible de charger les messages.');
    } finally {
      setLoading(false);
    }
  };
  
  const confirmDelete = (messageId) => {
    setMessageToDelete(messageId);
    setShowDeleteModal(true);
  };
  
  const cancelDelete = () => {
    setMessageToDelete(null);
    setShowDeleteModal(false);
  };
  
  const handleDelete = async () => {
    if (!messageToDelete) return;
    
    try {
      await contactService.deleteMessage(messageToDelete);
      
      // Mettre à jour la liste des messages
      setMessages(messages.filter(msg => msg.id !== messageToDelete));
      
      setAlert({
        type: 'success',
        title: 'Succès',
        message: 'Le message a été supprimé avec succès.'
      });
    } catch (err) {
      console.error('Erreur lors de la suppression du message:', err);
      setAlert({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la suppression du message.'
      });
    } finally {
      setShowDeleteModal(false);
      setMessageToDelete(null);
    }
  };
  
  const handleAlertClose = () => {
    setAlert(null);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' à ' + date.toLocaleTimeString();
  };
  
  const goBack = () => {
    navigate('/admin');
  };
  
  if (loading) {
    return <Loader fullScreen text="Chargement des messages..." />;
  }
  
  return (
    <PageContainer>
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={handleAlertClose}
          autoClose={true}
        />
      )}
      
      <PageHeader>
        <PageTitle>Messages de contact</PageTitle>
        <BackButton onClick={goBack}>
          <FaArrowLeft /> Retour
        </BackButton>
      </PageHeader>
      
      {error ? (
        <Alert 
          type="error" 
          title="Erreur" 
          message={error} 
          onClose={() => setError(null)}
        />
      ) : (
        <MessagesWrapper>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <MessageHeader>
                  <MessageInfo>
                    <SenderName>
                      <FaUser /> {message.name}
                    </SenderName>
                    <SenderEmail href={`mailto:${message.email}`}>
                      <FaEnvelope /> {message.email}
                    </SenderEmail>
                    <MessageDate>
                      <FaClock /> {formatDate(message.sent_at)}
                    </MessageDate>
                  </MessageInfo>
                  <ActionsContainer>
                    <DeleteButton 
                      onClick={() => confirmDelete(message.id)}
                      title="Supprimer ce message"
                    >
                      <FaTrash />
                    </DeleteButton>
                  </ActionsContainer>
                </MessageHeader>
                <MessageContent>{message.message}</MessageContent>
              </MessageCard>
            ))
          ) : (
            <NoMessages>Aucun message de contact.</NoMessages>
          )}
        </MessagesWrapper>
      )}
      
      {showDeleteModal && (
        <ConfirmModal>
          <ModalContent>
            <ModalTitle>Confirmer la suppression</ModalTitle>
            <ModalText>
              Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
            </ModalText>
            <ModalActions>
              <ModalButton className="cancel" onClick={cancelDelete}>
                Annuler
              </ModalButton>
              <ModalButton className="delete" onClick={handleDelete}>
                Supprimer
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </ConfirmModal>
      )}
    </PageContainer>
  );
};

export default MessagesPage;
