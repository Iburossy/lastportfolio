import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowRight, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Button from '../components/Button';
import ProjectCard from '../components/ProjectCard';
import Loader from '../components/Loader';
import projectService from '../services/projectService';
import introService from '../services/introService';

// Styles
const Hero = styled.section`
  padding: 5rem 0;
  background: white;
  color: var(--text-primary);
  text-align: left;
`;

const HeroContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const GreetingText = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--primary);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  max-width: 800px;
  margin: 0 0 2.5rem;
  line-height: 1.6;
  color: var(--text-secondary);

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const HighlightedText = styled.span`
  color: var(--primary);
  font-weight: 600;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const SocialIconLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: var(--text-primary);
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary);
    color: white;
    transform: translateY(-3px);
  }
`;

const Section = styled.section`
  padding: 5rem 0;
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ViewAllLink = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [introData, setIntroData] = useState({
    title: "",
    subtitle: "",
    description: "",
    button_text: "",
    button_link: "/"
  });
  const [loading, setLoading] = useState(true);
  const [introLoading, setIntroLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation variants
  const heroTextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6 } 
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      transition: { 
        duration: 0.3, 
        type: "spring", 
        stiffness: 400 
      } 
    },
    tap: { scale: 0.95 }
  };

  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const response = await introService.getIntro();
        if (response.success && response.data) {
          setIntroData(response.data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des informations d\'introduction:', err);
      } finally {
        setIntroLoading(false);
      }
    };
    
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        // Trier les projets pour mettre les plus récents en premier et limiter à 3
        const sortedProjects = response.data
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 3);
        
        setProjects(sortedProjects);
      } catch (err) {
        console.error('Erreur lors du chargement des projets:', err);
        setError('Impossible de charger les projets. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchIntro();
    fetchProjects();
  }, []);

  return (
    <>
      <Hero>
        <HeroContainer>
          {introLoading ? (
            <Loader text="Chargement..." />
          ) : (
            <>
              <GreetingText
                initial="hidden"
                animate="visible"
                variants={heroTextVariants}
              >
                
              </GreetingText>
              <HeroTitle
                initial="hidden"
                animate="visible"
                variants={heroTextVariants}
              >
                {introData.title}
              </HeroTitle>
              <HeroSubtitle
                initial="hidden"
                animate="visible"
                variants={heroTextVariants}
                transition={{ delay: 0.2 }}
              >
                {introData.subtitle}
              </HeroSubtitle>
              {introData.description && (
                <HeroSubtitle
                  initial="hidden"
                  animate="visible"
                  variants={heroTextVariants}
                  transition={{ delay: 0.3 }}
                  style={{ fontSize: '1.2rem', marginTop: '-1rem' }}
                >
                  {introData.description}
                </HeroSubtitle>
              )}
              {introData.button_text && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={heroTextVariants}
                  transition={{ delay: 0.4 }}
                >
                  <Button 
                    to={introData.button_link || '/about'} 
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {introData.button_text} <FaArrowRight style={{ marginLeft: '8px' }} />
                  </Button>
                </motion.div>
              )}
              
              <SocialIcons>
                <SocialIconLink 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGithub />
                </SocialIconLink>
                <SocialIconLink 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaLinkedin />
                </SocialIconLink>
                <SocialIconLink 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTwitter />
                </SocialIconLink>
              </SocialIcons>
            </>
          )}
        </HeroContainer>
      </Hero>

      <Section>
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>Projets Récents</SectionTitle>
            <SectionSubtitle>
              
            </SectionSubtitle>
          </SectionHeader>

          {loading ? (
            <Loader text="Chargement des projets..." />
          ) : error ? (
            <p style={{ textAlign: 'center', color: 'var(--error)' }}>{error}</p>
          ) : projects.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              Aucun projet disponible pour le moment.
            </p>
          ) : (
            <>
              <ProjectsGrid>
                {projects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </ProjectsGrid>

              <ViewAllLink>
                <Button to="/projects" variant="outline">
                  Voir tous les projets <FaArrowRight style={{ marginLeft: '0.5rem' }} />
                </Button>
              </ViewAllLink>
            </>
          )}
        </SectionContainer>
      </Section>
    </>
  );
};

export default HomePage;
