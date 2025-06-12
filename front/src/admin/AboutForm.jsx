import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import aboutService from '../services/aboutService';

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

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
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

// Styles pour l'upload de fichier
const FileInputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const FileInput = styled.input`
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: -1;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: white;
  font-weight: 500;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const ImagePreviewContainer = styled.div`
  margin: 1rem 0;
  position: relative;
  width: 150px;
`;

const ImagePreview = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: var(--border-radius);
  border: 2px solid var(--border-color);
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: var(--error);
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const AboutForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors } 
  } = useForm();
  
  // Récupérer les données de la section About
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await aboutService.getAbout();
        console.log('Réponse complète:', response);
        
        // Vérifier la structure de la réponse et accéder aux données correctement
        const aboutData = response.data && response.data.data ? response.data.data : response.data;
        console.log('Données reçues du backend:', aboutData);
        
        if (!aboutData) {
          console.error('Aucune donnée reçue du backend');
          return;
        }
        
        // Préremplir le formulaire
        setValue('fullName', aboutData.fullName || '');
        setValue('title', aboutData.title || '');
        setValue('bio', aboutData.bio || aboutData.content || '');
        
        // Gérer les spécialités (convertir le tableau en chaîne)
        if (aboutData.specialties && Array.isArray(aboutData.specialties)) {
          setValue('specialties', aboutData.specialties.join(', '));
        } else if (typeof aboutData.specialties === 'string') {
          setValue('specialties', aboutData.specialties);
        } else {
          setValue('specialties', '');
        }
        
        // Afficher la photo si elle existe
        if (aboutData.photo_url) {
          // Utiliser l'URL de base de l'API depuis le service
          const baseURL = 'http://localhost:5000';
          setPreviewImage(`${baseURL}${aboutData.photo_url}`);
          console.log('URL de la photo:', `${baseURL}${aboutData.photo_url}`);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setAlert({
          type: 'error',
          title: 'Erreur',
          message: 'Impossible de charger les données du profil.'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAboutData();
  }, [setValue]);
  
  const onSubmit = async (data) => {
    setSubmitting(true);
    
    try {
      // Convertir les spécialités en tableau
      const specialties = data.specialties
        .split(',')
        .map(specialty => specialty.trim())
        .filter(specialty => specialty);
      
      // Créer les compétences au format attendu par le backend
      const skills = specialties.map(name => ({
        name,
        level: 80 // Niveau par défaut
      }));
      
      // Créer un FormData pour envoyer les données et la photo
      const formData = new FormData();
      
      // Ajouter les informations personnelles
      formData.append('fullName', data.fullName);
      formData.append('title', data.title);
      formData.append('specialties', data.specialties);
      
      // Ajouter le contenu et les compétences
      formData.append('content', data.bio);
      formData.append('skills', JSON.stringify(skills));
      
      // Ajouter la photo si elle existe
      if (data.photo && data.photo.length > 0) {
        formData.append('photo', data.photo[0]);
      }
      
      console.log('Envoi des données au backend avec photo:', (data.photo && data.photo.length > 0) ? data.photo[0].name : 'aucune photo');
      console.log('Données envoyées:', {
        fullName: data.fullName,
        title: data.title,
        specialties: data.specialties
      });
      
      // Utiliser le service pour envoyer les données
      await aboutService.updateAbout(formData);
      
      setAlert({
        type: 'success',
        title: 'Succès',
        message: 'Votre profil a été mis à jour avec succès.'
      });
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      setAlert({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la mise à jour du profil.'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleAlertClose = () => {
    setAlert(null);
  };
  
  const goBack = () => {
    navigate('/admin');
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
          autoClose={true}
        />
      )}
      
      <FormHeader>
        <FormTitle>Modifier le profil</FormTitle>
        <BackButton onClick={goBack}>
          <FaArrowLeft /> Retour
        </BackButton>
      </FormHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSection>
          <SectionTitle>Informations personnelles</SectionTitle>
          
          <FormRow>
            <HalfWidthField>
              <Label htmlFor="fullName">Nom complet *</Label>
              <Input
                id="fullName"
                type="text"
                error={errors.fullName}
                {...register('fullName', { 
                  required: 'Le nom complet est requis' 
                })}
                disabled={submitting}
              />
              {errors.fullName && (
                <ErrorMessage>{errors.fullName.message}</ErrorMessage>
              )}
            </HalfWidthField>
            
            <HalfWidthField>
              <Label htmlFor="title">Titre professionnel *</Label>
              <Input
                id="title"
                type="text"
                error={errors.title}
                {...register('title', { 
                  required: 'Le titre professionnel est requis' 
                })}
                disabled={submitting}
              />
              {errors.title && (
                <ErrorMessage>{errors.title.message}</ErrorMessage>
              )}
            </HalfWidthField>
          </FormRow>
          
          <FormField>
            <Label htmlFor="photo">Photo de profil</Label>
            <FileInputContainer>
              <FileInput
                id="photo"
                type="file"
                accept="image/*"
                error={errors.photo}
                {...register('photo')}
                disabled={submitting}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setPreviewImage(event.target.result);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
              <FileInputLabel htmlFor="photo">
                {previewImage ? 'Changer la photo' : 'Choisir une photo'}
              </FileInputLabel>
            </FileInputContainer>
            {previewImage && (
              <ImagePreviewContainer>
                <ImagePreview src={previewImage} alt="Aperçu de la photo" />
                <RemoveImageButton type="button" onClick={() => {
                  setValue('photo', null);
                  setPreviewImage(null);
                }}>
                  Supprimer
                </RemoveImageButton>
              </ImagePreviewContainer>
            )}
            {errors.photo && (
              <ErrorMessage>{errors.photo.message}</ErrorMessage>
            )}
          </FormField>
          
          <FormField>
            <Label htmlFor="specialties">
              Spécialités (séparées par des virgules) *
            </Label>
            <Input
              id="specialties"
              type="text"
              error={errors.specialties}
              {...register('specialties', { 
                required: 'Les spécialités sont requises' 
              })}
              placeholder="Développeur Web, Frontend, Backend, etc."
              disabled={submitting}
            />
            {errors.specialties && (
              <ErrorMessage>{errors.specialties.message}</ErrorMessage>
            )}
          </FormField>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Biographie</SectionTitle>
          
          <FormField>
            <Label htmlFor="bio">À propos de vous *</Label>
            <Textarea
              id="bio"
              error={errors.bio}
              {...register('bio', { 
                required: 'La biographie est requise',
                minLength: {
                  value: 50,
                  message: 'La biographie doit contenir au moins 50 caractères'
                }
              })}
              disabled={submitting}
              placeholder="Parlez de votre parcours, votre expérience, vos passions..."
            />
            {errors.bio && (
              <ErrorMessage>{errors.bio.message}</ErrorMessage>
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
              Enregistrer les modifications
            </>
          )}
        </SaveButton>
      </form>
    </FormContainer>
  );
};

export default AboutForm;
