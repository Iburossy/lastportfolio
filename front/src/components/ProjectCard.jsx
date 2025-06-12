import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGithub, FaYoutube } from 'react-icons/fa';
import Button from './Button';

const Card = styled(motion.article)`
  background-color: var(--paper);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* Ratio 16:9 par défaut */
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain; /* Changed from cover to contain */
  background-color: #f8f8f8; /* Fond léger pour les images avec transparence */
  transition: transform 0.5s ease;
  
  ${Card}:hover & {
    transform: scale(1.02);
  }
`;

const NoImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 1rem;
`;

const Content = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
`;

const Description = styled.p`
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  flex-grow: 1;
`;

const TechTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const TechTag = styled.span`
  background-color: rgba(0, 112, 243, 0.1);
  color: var(--primary);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SocialIcon = styled.a`
  color: var(--text-secondary);
  font-size: 1.25rem;
  transition: var(--transition);
  
  &:hover {
    color: ${props => props.github ? '#333' : '#ff0000'};
  }
`;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const ProjectCard = ({ project, index }) => {
  const {
    id,
    title,
    description,
    technologies,
    github_link,
    youtube_link,
    image_urls
  } = project;
  
  // Limiter la description à 100 caractères
  const truncatedDescription = description.length > 100
    ? `${description.substring(0, 100)}...`
    : description;
  
  // Récupérer la première image s'il y en a une
  const firstImage = image_urls && image_urls.length > 0 ? image_urls[0] : null;
  
  return (
    <Card
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
    >
      <ImageContainer>
        {firstImage ? (
          <Image src={firstImage} alt={title} />
        ) : (
          <NoImage>Pas d'image disponible</NoImage>
        )}
      </ImageContainer>
      
      <Content>
        <Title>{title}</Title>
        <Description>{truncatedDescription}</Description>
        
        <TechTags>
          {technologies && Array.isArray(technologies) && 
            // Traiter toutes les technologies comme un tableau plat
            technologies
              .flatMap(tech => {
                // Si c'est une chaîne avec des virgules, la diviser
                if (typeof tech === 'string' && tech.includes(',')) {
                  return tech.split(',').map(t => t.trim()).filter(t => t !== '');
                }
                return tech;
              })
              .slice(0, 5) // Limiter à 5 technologies affichées
              .map((tech, index) => (
                <TechTag key={index}>{tech}</TechTag>
              ))
          }
          {technologies && Array.isArray(technologies) && 
            technologies.flatMap(tech => {
              if (typeof tech === 'string' && tech.includes(',')) {
                return tech.split(',').map(t => t.trim()).filter(t => t !== '');
              }
              return tech;
            }).length > 5 && (
              <TechTag>+{technologies.flatMap(tech => {
                if (typeof tech === 'string' && tech.includes(',')) {
                  return tech.split(',').map(t => t.trim()).filter(t => t !== '');
                }
                return tech;
              }).length - 5}</TechTag>
            )
          }
        </TechTags>
        
        <CardFooter>
          <Button to={`/projects/${id}`} $small>
            Voir le projet
          </Button>
          
          <SocialLinks>
            {github_link && (
              <SocialIcon 
                href={github_link} 
                target="_blank" 
                rel="noopener noreferrer"
                github
              >
                <FaGithub />
              </SocialIcon>
            )}
            
            {youtube_link && (
              <SocialIcon 
                href={youtube_link} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </SocialIcon>
            )}
          </SocialLinks>
        </CardFooter>
      </Content>
    </Card>
  );
};

export default ProjectCard;
