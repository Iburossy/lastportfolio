import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaFilter, FaTimes } from 'react-icons/fa';
import ProjectCard from '../components/ProjectCard';
import Loader from '../components/Loader';
import projectService from '../services/projectService';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto;
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const FilterPanel = styled(motion.div)`
  background-color: var(--paper);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FilterTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const Tag = styled.button`
  background-color: ${props => props.selected ? 'var(--primary)' : 'rgba(0, 112, 243, 0.1)'};
  color: ${props => props.selected ? 'white' : 'var(--primary)'};
  border: none;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: ${props => props.selected ? 'var(--primary-dark)' : 'rgba(0, 112, 243, 0.2)'};
  }
`;

const ClearFiltersButton = styled.button`
  background: none;
  border: 1px solid var(--text-secondary);
  color: var(--text-secondary);
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--text-primary);
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NoProjects = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: var(--text-secondary);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--error);
  background-color: rgba(220, 53, 69, 0.1);
  border-radius: var(--border-radius);
`;

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        setProjects(response.data);
        setFilteredProjects(response.data);
        
        // Extraire toutes les technologies uniques pour les filtres
        const tags = new Set();
        response.data.forEach(project => {
          if (project.technologies && Array.isArray(project.technologies)) {
            project.technologies.forEach(tech => tags.add(tech));
          }
        });
        
        setAllTags(Array.from(tags));
      } catch (err) {
        console.error('Erreur lors du chargement des projets:', err);
        setError('Impossible de charger les projets. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Appliquer les filtres lorsque les tags sélectionnés changent
  useEffect(() => {
    if (selectedTags.length === 0) {
      // Aucun filtre sélectionné, afficher tous les projets
      setFilteredProjects(projects);
    } else {
      // Filtrer les projets qui contiennent au moins un des tags sélectionnés
      const filtered = projects.filter(project => 
        project.technologies && 
        project.technologies.some(tech => selectedTags.includes(tech))
      );
      setFilteredProjects(filtered);
    }
  }, [selectedTags, projects]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (loading) {
    return <Loader fullScreen text="Chargement des projets..." />;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Mes Projets</PageTitle>
        <PageDescription>
          Découvrez l'ensemble des projets sur lesquels j'ai travaillé, 
          incluant le développement web frontend, backend et des applications complètes.
        </PageDescription>
      </PageHeader>

      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <>
          <FiltersContainer>
            <FilterButton onClick={toggleFilters}>
              <FaFilter />
              Filtrer par technologie
            </FilterButton>
          </FiltersContainer>

          {showFilters && (
            <FilterPanel
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FilterTitle>
                Filtrer par technologie
                <CloseButton onClick={toggleFilters}>
                  <FaTimes />
                </CloseButton>
              </FilterTitle>
              <TagsContainer>
                {allTags.map((tag, index) => (
                  <Tag 
                    key={index} 
                    selected={selectedTags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
              </TagsContainer>
              {selectedTags.length > 0 && (
                <ClearFiltersButton onClick={clearFilters}>
                  Effacer les filtres
                </ClearFiltersButton>
              )}
            </FilterPanel>
          )}

          {filteredProjects.length > 0 ? (
            <ProjectsGrid>
              {filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index}
                />
              ))}
            </ProjectsGrid>
          ) : (
            <NoProjects>
              <p>Aucun projet ne correspond aux filtres sélectionnés.</p>
              {selectedTags.length > 0 && (
                <ClearFiltersButton onClick={clearFilters} style={{ marginTop: '1rem' }}>
                  Effacer les filtres
                </ClearFiltersButton>
              )}
            </NoProjects>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default ProjectsPage;
