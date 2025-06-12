import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { FaSave, FaArrowLeft, FaTimes } from 'react-icons/fa';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import projectService from '../services/projectService';

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
  
  &.half-width {
    @media (min-width: 768px) {
      width: 48%;
    }
  }
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
  min-height: 200px;
  
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

const UploadContainer = styled.div`
  border: 2px dashed #e1e1e1;
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  background-color: var(--background);
  
  &:hover {
    border-color: var(--primary);
    background-color: #f8f9fa;
  }
`;

const UploadInput = styled.input`
  display: none;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const PreviewItem = styled.div`
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  background-color: #e1e1e1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &.landscape {
    aspect-ratio: 16 / 9;
  }

  &.portrait {
    aspect-ratio: 9 / 16;
  }

  &.square {
    aspect-ratio: 1 / 1;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  padding: 0;
  
  &:hover {
    background-color: var(--error);
    transform: scale(1.1);
  }
`;

const SaveButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm();

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const currentTotal = imageFiles.length + existingImages.length;

    if (currentTotal + files.length > 10) {
      setAlert({ type: 'error', message: 'Vous ne pouvez avoir que 10 images au maximum par projet.' });
      return;
    }

    setImageFiles(prev => [...prev, ...files]);

    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveNewImage = (indexToRemove) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove].url);
    
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveExistingImage = (imageUrlToRemove) => {
    setExistingImages(prev => prev.filter(url => url !== imageUrlToRemove));
  };
  
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const fetchProject = async () => {
        try {
          const response = await projectService.getProjectById(id);
          const project = response.data;
          
          const projectData = {
            title: project.title,
            description: project.description,
            technologies: project.technologies ? project.technologies.join(', ') : '',
            github_link: project.github_link || '',
            live_link: project.live_link || '',
            youtube_link: project.youtube_link || ''
          };
          reset(projectData);
          setExistingImages(project.image_urls || []);
        } catch (err) {
          console.error('Erreur lors du chargement du projet:', err);
          setError('Impossible de charger les données du projet.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchProject();
    }
  }, [id, isEditMode, reset]);
  
  const onSubmit = async (data) => {
    setSubmitting(true);
    
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('github_link', data.github_link || '');
    formData.append('live_link', data.live_link || '');
    formData.append('youtube_link', data.youtube_link || '');

    const technologies = data.technologies
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech);
    technologies.forEach(tech => formData.append('technologies[]', tech));

    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    if (isEditMode) {
      existingImages.forEach(url => formData.append('existingImages[]', url));
    }

    try {
      if (isEditMode) {
        await projectService.updateProject(id, formData);
        setAlert({
          type: 'success',
          message: 'Projet mis à jour avec succès !'
        });
      } else {
        await projectService.createProject(formData);
        setAlert({
          type: 'success',
          message: 'Projet créé avec succès !'
        });
        reset();
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
      }
      
      setTimeout(() => navigate('/admin/projects'), 2000);
      
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      const errorMessage = err.response?.data?.message || 'Une erreur est survenue.';
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleAlertClose = () => {
    setAlert(null);
  };
  
  const goBack = () => {
    navigate('/admin/projects');
  };
  
  if (loading) {
    return <Loader fullScreen text="Chargement du projet..." />;
  }
  
  return (
    <FormContainer>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={handleAlertClose}
          autoClose={true}
        />
      )}
      
      <FormHeader>
        <FormTitle>
          {isEditMode ? 'Modifier le projet' : 'Créer un nouveau projet'}
        </FormTitle>
        <BackButton onClick={goBack}>
          <FaArrowLeft /> Retour
        </BackButton>
      </FormHeader>
      
      {error ? (
        <Alert 
          type="error" 
          title="Erreur" 
          message={error} 
          onClose={() => setError(null)}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <FormSection>
            <SectionTitle>Images du Projet</SectionTitle>
            <UploadContainer onClick={() => document.getElementById('imageUpload').click()}>
              <UploadInput 
                id="imageUpload" 
                type="file" 
                multiple 
                accept="image/jpeg, image/png, image/gif, image/webp" 
                onChange={handleImageChange} 
              />
              <p>Cliquez ou glissez-déposez pour ajouter des images (jusqu'à 10).</p>
            </UploadContainer>
            
            <PreviewGrid>
              {existingImages.map((imageUrl, index) => (
                <PreviewItem key={`existing-${index}`}>
                  <img src={imageUrl} alt={`Aperçu existant ${index + 1}`} />
                  <RemoveButton onClick={() => handleRemoveExistingImage(imageUrl)}>
                    <FaTimes />
                  </RemoveButton>
                </PreviewItem>
              ))}
              {imagePreviews.map((preview, index) => (
                <PreviewItem key={`new-${index}`}>
                  <img src={preview.url} alt={`Aperçu ${index + 1}`} />
                  <RemoveButton onClick={() => handleRemoveNewImage(index)}>
                    <FaTimes />
                  </RemoveButton>
                </PreviewItem>
              ))}
            </PreviewGrid>
          </FormSection>

          <FormSection>
            <SectionTitle>Détails du Projet</SectionTitle>
            
            <FormField>
              <Label htmlFor="title">Titre du projet *</Label>
              <Input
                id="title"
                type="text"
                error={errors.title}
                {...register('title', { required: 'Le titre est requis' })}
              />
              {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
            </FormField>

            <FormField>
              <Label htmlFor="technologies">Technologies (séparées par des virgules)</Label>
              <Input
                id="technologies"
                type="text"
                {...register('technologies')}
              />
            </FormField>

            <FormField>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows="10"
                error={errors.description}
                {...register('description', { required: 'La description est requise' })}
              />
              {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
            </FormField>
          </FormSection>

          <FormSection>
            <SectionTitle>Liens</SectionTitle>
            <FormRow>
              <FormField className="half-width">
                <Label htmlFor="github_link">Lien GitHub</Label>
                <Input
                  id="github_link"
                  type="url"
                  {...register('github_link')}
                />
              </FormField>
              <FormField className="half-width">
                <Label htmlFor="live_link">Lien du site en ligne</Label>
                <Input
                  id="live_link"
                  type="url"
                  {...register('live_link')}
                />
              </FormField>
            </FormRow>
            <FormField>
              <Label htmlFor="youtube_link">Lien YouTube</Label>
              <Input
                id="youtube_link"
                type="url"
                {...register('youtube_link')}
              />
            </FormField>
          </FormSection>

          <SaveButton type="submit" $fullWidth disabled={submitting}>
            <FaSave />
            {submitting ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Créer le projet')}
          </SaveButton>
        </form>
      )}
    </FormContainer>
  );
};

export default ProjectForm;
