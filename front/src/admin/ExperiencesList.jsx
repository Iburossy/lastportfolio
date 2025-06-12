import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import experienceService from '../services/experienceService';

// Styles
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
`;

const ExperiencesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ExperienceCard = styled.div`
  background-color: var(--paper);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const ExperienceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ExperienceTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const ExperienceCompany = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--primary);
  margin-bottom: 0.5rem;
`;

const ExperienceInfo = styled.div`
  flex: 1;
`;

const ExperienceActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.color || 'var(--text-secondary)'};
  cursor: pointer;
  transition: var(--transition);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.hoverColor || 'var(--primary)'};
  }
`;

const ExperienceDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ExperienceDetail = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ExperienceDescription = styled.p`
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.6;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--paper);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  color: var(--text-secondary);
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  
  background-color: ${props => {
    if (props.variant === 'primary') return 'var(--primary)';
    if (props.variant === 'danger') return 'var(--error)';
    return '#e9ecef';
  }};
  
  color: ${props => {
    if (props.variant === 'primary' || props.variant === 'danger') return 'white';
    return 'var(--text-primary)';
  }};
  
  &:hover {
    opacity: 0.9;
  }
`;

const ExperiencesListPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);
  
  // Récupérer toutes les expériences
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await experienceService.getAllExperiences();
        setExperiences(response.data || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des expériences:', err);
        setAlert({
          type: 'error',
          title: 'Erreur',
          message: 'Impossible de charger les expériences professionnelles.'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchExperiences();
  }, []);
  
  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Présent';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('fr-FR', options);
  };
  
  // Ouvrir la modal de confirmation de suppression
  const handleDeleteClick = (experience) => {
    setExperienceToDelete(experience);
    setShowDeleteModal(true);
  };
  
  // Fermer la modal de confirmation
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setExperienceToDelete(null);
  };
  
  // Supprimer une expérience
  const handleConfirmDelete = async () => {
    if (!experienceToDelete) return;
    
    try {
      await experienceService.deleteExperience(experienceToDelete.id);
      
      // Mettre à jour la liste des expériences
      setExperiences(experiences.filter(exp => exp.id !== experienceToDelete.id));
      
      setAlert({
        type: 'success',
        title: 'Succès',
        message: 'L\'expérience a été supprimée avec succès.'
      });
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'expérience:', err);
      setAlert({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la suppression de l\'expérience.'
      });
    } finally {
      setShowDeleteModal(false);
      setExperienceToDelete(null);
    }
  };
  
  const handleAlertClose = () => {
    setAlert(null);
  };
  
  if (loading) {
    return <Loader fullScreen text="Chargement des expériences..." />;
  }
  
  return (
    <Container>
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={handleAlertClose}
          autoClose={alert.type === 'success'}
        />
      )}
      
      <Header>
        <Title>Expériences professionnelles</Title>
        <Button as={Link} to="/admin/experiences/new">
          <FaPlus /> Ajouter une expérience
        </Button>
      </Header>
      
      {experiences.length > 0 ? (
        <ExperiencesList>
          {experiences.map(experience => (
            <ExperienceCard key={experience.id}>
              <ExperienceHeader>
                <ExperienceInfo>
                  <ExperienceTitle>{experience.title}</ExperienceTitle>
                  <ExperienceCompany>{experience.company}</ExperienceCompany>
                </ExperienceInfo>
                <ExperienceActions>
                  <ActionButton 
                    as={Link} 
                    to={`/admin/experiences/edit/${experience.id}`}
                  >
                    <FaEdit />
                  </ActionButton>
                  <ActionButton 
                    color="var(--error)" 
                    hoverColor="#d32f2f"
                    onClick={() => handleDeleteClick(experience)}
                  >
                    <FaTrash />
                  </ActionButton>
                </ExperienceActions>
              </ExperienceHeader>
              
              <ExperienceDetails>
                <ExperienceDetail>
                  <FaCalendarAlt />
                  {formatDate(experience.startDate)} - {experience.current ? 'Présent' : formatDate(experience.endDate)}
                </ExperienceDetail>
                {experience.location && (
                  <ExperienceDetail>
                    <FaBriefcase />
                    {experience.location}
                  </ExperienceDetail>
                )}
              </ExperienceDetails>
              
              {experience.description && (
                <ExperienceDescription>
                  {experience.description}
                </ExperienceDescription>
              )}
            </ExperienceCard>
          ))}
        </ExperiencesList>
      ) : (
        <EmptyMessage>
          <FaBriefcase size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>Aucune expérience professionnelle n'a été ajoutée.</p>
          <p>Cliquez sur "Ajouter une expérience" pour commencer.</p>
        </EmptyMessage>
      )}
      
      {showDeleteModal && (
        <ConfirmationModal>
          <ModalContent>
            <ModalTitle>Confirmer la suppression</ModalTitle>
            <ModalText>
              Êtes-vous sûr de vouloir supprimer l'expérience "{experienceToDelete?.title}" chez {experienceToDelete?.company} ?
              Cette action est irréversible.
            </ModalText>
            <ModalActions>
              <ModalButton onClick={handleCloseModal}>
                Annuler
              </ModalButton>
              <ModalButton variant="danger" onClick={handleConfirmDelete}>
                Supprimer
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </ConfirmationModal>
      )}
    </Container>
  );
};

export default ExperiencesListPage;
