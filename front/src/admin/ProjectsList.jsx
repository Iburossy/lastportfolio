import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaPencilAlt, FaTrashAlt, FaImage } from 'react-icons/fa';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import projectService from '../services/projectService';

// Styles
const ProjectsContainer = styled.div`
  max-width: 1200px;
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

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.$danger ? 'var(--error)' : 'var(--primary)'};
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  transition: var(--transition);
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
`;

const ProjectsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e1e1e1;
  }
  
  th {
    font-weight: 600;
    color: var(--text-secondary);
    background-color: #f9f9f9;
  }
  
  tr:hover {
    background-color: #f5f5f5;
  }
`;

const ActionsCell = styled.td`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const NoProjects = styled.div`
  text-align: center;
  padding: 3rem;
  border: 1px dashed #e1e1e1;
  border-radius: var(--border-radius);
  margin: 2rem 0;
  
  p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }
`;

const ThumbnailCell = styled.td`
  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: var(--border-radius);
  }
`;

// Composant principal
const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getAllProjects();
      setProjects(response.data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des projets:', err);
      setError('Impossible de charger la liste des projets.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }
    
    try {
      await projectService.deleteProject(id);
      setAlert({
        type: 'success',
        message: 'Projet supprimé avec succès!'
      });
      fetchProjects(); // Rafraîchir la liste
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setAlert({
        type: 'error',
        message: 'Erreur lors de la suppression du projet.'
      });
    }
  };
  
  const handleAlertClose = () => {
    setAlert(null);
  };
  
  if (loading) {
    return <Loader fullScreen text="Chargement des projets..." />;
  }
  
  if (error) {
    return (
      <ProjectsContainer>
        <Alert 
          type="error" 
          title="Erreur" 
          message={error}
          onClose={() => setError(null)}
        />
      </ProjectsContainer>
    );
  }
  
  return (
    <ProjectsContainer>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={handleAlertClose}
          autoClose={true}
        />
      )}
      
      <Header>
        <Title>Gestion des projets</Title>
        <Link to="/admin/projects/new">
          <Button type="button">
            <FaPlus /> Nouveau projet
          </Button>
        </Link>
      </Header>
      
      {projects.length > 0 ? (
        <ProjectsTable>
          <thead>
            <tr>
              <th>Image</th>
              <th>Titre</th>
              <th>Technologies</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <ThumbnailCell>
                  {project.image_urls && project.image_urls.length > 0 ? (
                    <img 
                      src={project.image_urls[0]} 
                      alt={`Aperçu de ${project.title}`} 
                    />
                  ) : (
                    <FaImage size={40} color="#ccc" />
                  )}
                </ThumbnailCell>
                <td>{project.title}</td>
                <td>
                  {project.technologies && Array.isArray(project.technologies)
                    ? project.technologies.join(', ')
                    : project.technologies}
                </td>
                <td>
                  {new Date(project.created_at).toLocaleDateString('fr-FR')}
                </td>
                <ActionsCell>
                  <Link to={`/admin/projects/${project.id}/edit`}>
                    <ActionButton title="Modifier">
                      <FaPencilAlt />
                    </ActionButton>
                  </Link>
                  <ActionButton 
                    $danger 
                    onClick={() => handleDelete(project.id)}
                    title="Supprimer"
                  >
                    <FaTrashAlt />
                  </ActionButton>
                </ActionsCell>
              </tr>
            ))}
          </tbody>
        </ProjectsTable>
      ) : (
        <NoProjects>
          <p>Aucun projet n'a été trouvé.</p>
          <Link to="/admin/projects/new">
            <Button type="button">
              <FaPlus /> Créer votre premier projet
            </Button>
          </Link>
        </NoProjects>
      )}
    </ProjectsContainer>
  );
};

export default ProjectsList;
