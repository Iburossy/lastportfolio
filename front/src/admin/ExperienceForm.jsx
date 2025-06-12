import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { FaSave, FaArrowLeft, FaCalendarAlt, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import experienceService from '../services/experienceService';

// Styles
const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const FormTitle = styled.h1`
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

const FormSection = styled.section`
  background-color: var(--paper);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const HalfWidthField = styled(FormField)`
  @media (min-width: 768px) {
    width: 48%;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
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

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.error ? 'var(--error)' : '#e1e1e1'};
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: 1rem;
  transition: var(--transition);
  resize: vertical;
  min-height: 150px;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const CheckboxLabel = styled.label`
  font-size: 1rem;
  color: var(--text-primary);
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: var(--error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SaveButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const ExperienceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isCurrent, setIsCurrent] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    setValue,
    watch,
    formState: { errors } 
  } = useForm();
  
  const watchIsCurrent = watch('current', false);
  
  // Récupérer les données de l'expérience si on est en mode édition
  useEffect(() => {
    if (isEditing) {
      const fetchExperience = async () => {
        try {
          const response = await experienceService.getExperienceById(id);
          const experience = response.data;
          
          if (!experience) {
            setAlert({
              type: 'error',
              title: 'Erreur',
              message: 'Expérience non trouvée'
            });
            return;
          }
          
          // Formater les dates pour l'input date
          const startDate = new Date(experience.startDate).toISOString().split('T')[0];
          let endDate = experience.endDate 
            ? new Date(experience.endDate).toISOString().split('T')[0] 
            : '';
          
          // Préremplir le formulaire
          setValue('title', experience.title || '');
          setValue('company', experience.company || '');
          setValue('location', experience.location || '');
          setValue('startDate', startDate);
          setValue('endDate', endDate);
          setValue('current', experience.current || false);
          setValue('description', experience.description || '');
          
          setIsCurrent(experience.current || false);
        } catch (err) {
          console.error('Erreur lors du chargement de l\'expérience:', err);
          setAlert({
            type: 'error',
            title: 'Erreur',
            message: 'Impossible de charger les données de l\'expérience.'
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchExperience();
    }
  }, [id, isEditing, setValue]);
  
  const onSubmit = async (data) => {
    setSubmitting(true);
    
    try {
      // Si l'expérience est en cours, on ne définit pas de date de fin
      if (data.current) {
        data.endDate = null;
      }
      
      if (isEditing) {
        await experienceService.updateExperience(id, data);
        setAlert({
          type: 'success',
          title: 'Succès',
          message: 'L\'expérience a été mise à jour avec succès.'
        });
      } else {
        await experienceService.createExperience(data);
        setAlert({
          type: 'success',
          title: 'Succès',
          message: 'L\'expérience a été créée avec succès.'
        });
        
        // Rediriger vers la liste des expériences après un court délai
        setTimeout(() => {
          navigate('/admin/experiences');
        }, 2000);
      }
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'expérience:', err);
      setAlert({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue lors de l\'enregistrement de l\'expérience.'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleAlertClose = () => {
    setAlert(null);
  };
  
  const goBack = () => {
    navigate('/admin/experiences');
  };
  
  if (loading) {
    return <Loader fullScreen text="Chargement des données..." />;
  }
  
  return (
    <FormContainer>
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={handleAlertClose}
          autoClose={alert.type === 'success'}
        />
      )}
      
      <FormHeader>
        <FormTitle>
          {isEditing ? 'Modifier l\'expérience' : 'Ajouter une expérience'}
        </FormTitle>
        <BackButton onClick={goBack}>
          <FaArrowLeft /> Retour
        </BackButton>
      </FormHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSection>
          <FormRow>
            <HalfWidthField>
              <Label htmlFor="title">
                <FaBriefcase style={{ marginRight: '0.5rem' }} />
                Poste / Titre *
              </Label>
              <Input
                id="title"
                type="text"
                error={errors.title}
                {...register('title', { 
                  required: 'Le titre du poste est requis' 
                })}
                disabled={submitting}
                placeholder="Ex: Développeur Web Frontend"
              />
              {errors.title && (
                <ErrorMessage>{errors.title.message}</ErrorMessage>
              )}
            </HalfWidthField>
            
            <HalfWidthField>
              <Label htmlFor="company">
                <FaBriefcase style={{ marginRight: '0.5rem' }} />
                Entreprise / Organisation *
              </Label>
              <Input
                id="company"
                type="text"
                error={errors.company}
                {...register('company', { 
                  required: 'Le nom de l\'entreprise est requis' 
                })}
                disabled={submitting}
                placeholder="Ex: Acme Inc."
              />
              {errors.company && (
                <ErrorMessage>{errors.company.message}</ErrorMessage>
              )}
            </HalfWidthField>
          </FormRow>
          
          <FormField>
            <Label htmlFor="location">
              <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
              Lieu
            </Label>
            <Input
              id="location"
              type="text"
              error={errors.location}
              {...register('location')}
              disabled={submitting}
              placeholder="Ex: Paris, France"
            />
            {errors.location && (
              <ErrorMessage>{errors.location.message}</ErrorMessage>
            )}
          </FormField>
          
          <FormRow>
            <HalfWidthField>
              <Label htmlFor="startDate">
                <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                Date de début *
              </Label>
              <Input
                id="startDate"
                type="date"
                error={errors.startDate}
                {...register('startDate', { 
                  required: 'La date de début est requise' 
                })}
                disabled={submitting}
              />
              {errors.startDate && (
                <ErrorMessage>{errors.startDate.message}</ErrorMessage>
              )}
            </HalfWidthField>
            
            <HalfWidthField>
              <Label htmlFor="endDate">
                <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                Date de fin
              </Label>
              <Input
                id="endDate"
                type="date"
                error={errors.endDate}
                {...register('endDate')}
                disabled={submitting || watchIsCurrent}
              />
              {errors.endDate && (
                <ErrorMessage>{errors.endDate.message}</ErrorMessage>
              )}
              
              <CheckboxContainer>
                <Checkbox
                  id="current"
                  type="checkbox"
                  {...register('current')}
                  disabled={submitting}
                />
                <CheckboxLabel htmlFor="current">
                  Poste actuel
                </CheckboxLabel>
              </CheckboxContainer>
            </HalfWidthField>
          </FormRow>
          
          <FormField>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              error={errors.description}
              {...register('description')}
              disabled={submitting}
              placeholder="Décrivez vos responsabilités, réalisations et compétences utilisées..."
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </FormField>
        </FormSection>
        
        <SaveButton 
          type="submit" 
          $fullWidth 
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader size="20px" />
              Enregistrement...
            </>
          ) : (
            <>
              <FaSave />
              {isEditing ? 'Mettre à jour' : 'Ajouter l\'expérience'}
            </>
          )}
        </SaveButton>
      </form>
    </FormContainer>
  );
};

export default ExperienceForm;
