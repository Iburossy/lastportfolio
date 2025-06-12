import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaGithub, FaYoutube, FaExternalLinkAlt } from 'react-icons/fa';
import Loader from '../components/Loader';
import Button from '../components/Button';
import projectService from '../services/projectService';

// Styles
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 2rem;
  transition: var(--transition);
  
  &:hover {
    color: var(--primary);
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ProjectHeader = styled.div`
  margin-bottom: 3rem;
`;

const ProjectTitle = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const Tag = styled.span`
  background-color: rgba(0, 112, 243, 0.1);
  color: var(--primary);
  border-radius: 50px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px; /* Hauteur fixe pour garantir la visibilité */
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  margin-bottom: 3rem;
  background-color: #f8f8f8;
  
  @media (max-width: 768px) {
    height: 350px;
  }
`;

const Slide = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${props => props.$active ? 'block' : 'none'};
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain; /* Préserve les proportions de l'image */
  display: block;
  margin: 0 auto;
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 1.2rem;
`;

const CarouselControls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const CarouselDot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.6)'};
  border: none;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.8)'};
  }
`;

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: var(--transition);
  z-index: 10;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
  
  &.prev {
    left: 20px;
  }
  
  &.next {
    right: 20px;
  }
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
`;

const ContentSection = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
`;

const Description = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-primary);
  
  p {
    margin-bottom: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => 
    props.github ? '#333' : 
    props.youtube ? '#ff0000' : 
    'var(--primary)'};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: var(--error);
`;

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectService.getProjectById(id);
        setProject(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement du projet:', err);
        setError('Impossible de charger les détails du projet. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const nextSlide = () => {
    if (project?.image_urls?.length > 0) {
      setCurrentSlide((prevSlide) => 
        prevSlide === project.image_urls.length - 1 ? 0 : prevSlide + 1
      );
    }
  };

  const prevSlide = () => {
    if (project?.image_urls?.length > 0) {
      setCurrentSlide((prevSlide) => 
        prevSlide === 0 ? project.image_urls.length - 1 : prevSlide - 1
      );
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return <Loader fullScreen text="Chargement du projet..." />;
  }

  if (error) {
    return (
      <PageContainer>
        <BackLink to="/projects">
          <FaArrowLeft /> Retour aux projets
        </BackLink>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }

  if (!project) {
    return (
      <PageContainer>
        <BackLink to="/projects">
          <FaArrowLeft /> Retour aux projets
        </BackLink>
        <ErrorMessage>Projet non trouvé.</ErrorMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackLink to="/projects">
        <FaArrowLeft /> Retour aux projets
      </BackLink>
      
      <ProjectHeader>
        <ProjectTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {project.title}
        </ProjectTitle>
        
        {project.technologies && (
          <TagsContainer>
            {project.technologies.map((tech, index) => (
              <Tag key={index}>{tech}</Tag>
            ))}
          </TagsContainer>
        )}
      </ProjectHeader>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CarouselContainer>
          {project.image_urls && project.image_urls.length > 0 ? (
            <>
              {project.image_urls.map((image, index) => (
                <Slide
                  key={index}
                  $active={index === currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <SlideImage src={image} alt={`${project.title} - Image ${index + 1}`} />
                </Slide>
              ))}
              
              {project.image_urls.length > 1 && (
                <>
                  <Arrow className="prev" onClick={prevSlide}>
                    &#10094;
                  </Arrow>
                  <Arrow className="next" onClick={nextSlide}>
                    &#10095;
                  </Arrow>
                  <CarouselControls>
                    {project.image_urls.map((_, index) => (
                      <CarouselDot
                        key={index}
                        active={index === currentSlide}
                        onClick={() => goToSlide(index)}
                      />
                    ))}
                  </CarouselControls>
                </>
              )}
            </>
          ) : (
            <NoImage>Aucune image disponible pour ce projet</NoImage>
          )}
        </CarouselContainer>
      </motion.div>
      
      <ContentSection>
        <SectionTitle>Description</SectionTitle>
        <Description dangerouslySetInnerHTML={{ __html: project.description }} />
        
        <LinksContainer>
          {project.github_link && (
            <LinkButton 
              href={project.github_link} 
              target="_blank" 
              rel="noopener noreferrer"
              github
            >
              <FaGithub /> Code Source
            </LinkButton>
          )}
          
          {project.youtube_link && (
            <LinkButton 
              href={project.youtube_link} 
              target="_blank" 
              rel="noopener noreferrer"
              youtube
            >
              <FaYoutube /> Démo Vidéo
            </LinkButton>
          )}
          
          {project.live_link && (
            <LinkButton 
              href={project.live_link} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaExternalLinkAlt /> Site Live
            </LinkButton>
          )}
        </LinksContainer>
      </ContentSection>
    </PageContainer>
  );
};

export default ProjectDetailPage;
