import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';
import projectService from '../services/projectService';

// Styles
const ImageSection = styled.section`
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

const UploadContainer = styled.div`
  border: 2px dashed ${props => props.isDragOver ? 'var(--primary)' : '#e1e1e1'};
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 1.5rem;
  
  &:hover {
    border-color: var(--primary-light);
    background-color: rgba(0, 112, 243, 0.05);
  }
`;

const UploadIcon = styled(FaUpload)`
  font-size: 2rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const ImageCard = styled.div`
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  height: 150px;
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(220, 53, 69, 0.8);
  color: white;
  border: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--error);
  }
`;

const ErrorMessage = styled.p`
  color: var(--error);
  text-align: center;
  margin-top: 1rem;
`;

const LoadingSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingMessage = styled.p`
  color: var(--text-secondary);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
`;

const UploadingProgress = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e1e1e1;
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: var(--primary);
  width: ${props => props.progress || 0}%;
  transition: width 0.3s ease;
`;

const ProjectImageManager = ({ projectId, onUpdate }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  useEffect(() => {
    if (projectId) {
      fetchImages();
    }
  }, [projectId]);
  
  const fetchImages = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const response = await projectService.getProjectById(projectId);
      setImages(response.data.image_urls || []);
    } catch (err) {
      console.error('Erreur lors du chargement des images:', err);
      setError('Impossible de charger les images du projet.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };
  
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };
  
  const handleFiles = async (files) => {
    if (!projectId) {
      setError('Veuillez d\'abord enregistrer le projet avant d\'ajouter des images.');
      return;
    }
    
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (validFiles.length === 0) {
      setError('Veuillez sélectionner uniquement des fichiers image.');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('image', file);
        
        await projectService.uploadProjectImage(projectId, formData, (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        });
      }
      
      // Recharger les images après l'upload
      await fetchImages();
      
      // Notifier le parent (ProjectForm) que les images ont été mises à jour
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Erreur lors de l\'upload des images:', err);
      setError('Une erreur est survenue lors de l\'upload des images.');
    } finally {
      setUploading(false);
    }
  };
  
  const handleDeleteImage = async (imageUrl) => {
    if (!projectId) return;
    
    try {
      await projectService.deleteProjectImage(projectId, imageUrl);
      
      // Mettre à jour la liste des images
      setImages(images.filter(url => url !== imageUrl));
      
      // Notifier le parent (ProjectForm) que les images ont été mises à jour
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'image:', err);
      setError('Une erreur est survenue lors de la suppression de l\'image.');
    }
  };
  
  return (
    <ImageSection>
      <SectionTitle>Images du projet</SectionTitle>
      
      <UploadContainer 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
        isDragOver={isDragOver}
      >
        <UploadIcon />
        <UploadText>
          Glissez-déposez vos images ici ou cliquez pour parcourir
        </UploadText>
        <UploadText>
          Formats acceptés: JPG, PNG, GIF, WEBP
        </UploadText>
        <HiddenInput 
          id="file-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
        />
      </UploadContainer>
      
      {uploading && (
        <>
          <LoadingMessage>
            <LoadingSpinner /> Upload en cours...
          </LoadingMessage>
          <UploadingProgress>
            <ProgressBar progress={uploadProgress} />
          </UploadingProgress>
        </>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <LoadingMessage>
          <LoadingSpinner /> Chargement des images...
        </LoadingMessage>
      ) : (
        <ImagesGrid>
          {images.map((imageUrl, index) => (
            <ImageCard key={index}>
              <ProjectImage src={imageUrl} alt={`Projet ${index + 1}`} />
              <DeleteButton 
                onClick={() => handleDeleteImage(imageUrl)}
                title="Supprimer cette image"
              >
                <FaTimes />
              </DeleteButton>
            </ImageCard>
          ))}
        </ImagesGrid>
      )}
    </ImageSection>
  );
};

export default ProjectImageManager;
