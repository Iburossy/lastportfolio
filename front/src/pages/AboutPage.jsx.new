import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaCode, FaTools, FaGraduationCap, FaServer, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import Button from '../components/Button';
import Loader from '../components/Loader';
import aboutService from '../services/aboutService';

// Styles
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  text-align: center;
  position: relative;
  padding-bottom: 0.5rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background-color: var(--primary);
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const AboutSection = styled.section`
  display: flex;
  background: #f8f9fa;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProfileContainer = styled.div`
  flex: 0 0 350px;
  background-color: rgba(230, 240, 255, 0.5);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    flex: initial;
    padding: 1.5rem;
  }
`;

const ProfileImage = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    width: 180px;
    height: 180px;
  }
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

const InfoItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  font-size: 1.15rem;
  
  svg {
    margin-right: 1rem;
    color: var(--primary);
    font-size: 1.25rem;
  }
  
  span {
    color: var(--text-primary);
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 2.5rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Name = styled.h2`
  font-size: 2.25rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: var(--text-primary);
`;

const JobTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--primary);
  font-weight: 500;
`;

const BioText = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 2rem;
  
  p {
    margin-bottom: 1rem;
  }
`;

const Formation = styled.div`
  margin-top: 2.5rem;
  margin-bottom: 2rem;
`;

const FormationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  margin-bottom: 1rem;
`;

const FormationDetails = styled.div`
  flex: 1;
`;

const FormationTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

const FormationPlace = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
`;

const FormationYear = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  font-weight: 600;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 80px;
    height: 3px;
    background-color: var(--primary);
  }
`;

const SkillsContainer = styled.section`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
`;

const SkillsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SkillItem = styled.div`
  margin-bottom: 1.25rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SkillName = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 1.1rem;
  color: var(--text-primary);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: var(--primary);
  border-radius: 5px;
  width: ${props => props.value || 0}%;
  transition: width 1s ease-in-out;
`;

const ErrorMessage = styled.p`
  color: #e53935;
  font-size: 1.1rem;
  text-align: center;
  margin: 2rem 0;
`;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const AboutPage = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await aboutService.getAbout();
        console.log('Réponse complète du backend:', response);
        setAboutData(response);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les informations. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return <Loader fullScreen text="Chargement des informations..." />;
  }

  if (error) {
    return (
      <PageContainer>
        <PageTitle>À Propos</PageTitle>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }

  // Accéder aux données depuis la bonne structure
  // Correction de l'accès aux données en fonction de la structure retournée par le service
  const aboutInfo = aboutData?.data || aboutData || {};
  console.log('Données About récupérées:', aboutInfo);
  
  // Extraire les compétences
  const skills = aboutInfo?.skills || [];
  
  // Grouper les compétences par catégorie
  let skillsByCategory = {};
  
  // Vérifier si les compétences existent et sont un tableau
  if (Array.isArray(skills) && skills.length > 0) {
    // Si aucune compétence n'a de catégorie, les mettre toutes dans 'Compétences'
    const hasCategories = skills.some(skill => skill.category);
    
    if (!hasCategories) {
      skillsByCategory = {
        'Compétences': skills
      };
    } else {
      // Grouper par catégorie si elles existent
      skillsByCategory = skills.reduce((acc, skill) => {
        // Si la catégorie n'est pas spécifiée, utiliser 'Autres'
        const category = skill.category || 'Autres';
        
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
      }, {});
    }
  }

  return (
    <PageContainer>
      <PageTitle>À propos de moi</PageTitle>
      
      {aboutData ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <AboutSection>
            <ProfileContainer>
              <ProfileImage 
                src={aboutInfo?.photo_url ? `http://localhost:5000${aboutInfo.photo_url}` : '/profile-placeholder.jpg'} 
                alt="Photo de profil" 
              />
              <InfoList>
                <InfoItem>
                  <FaUser />
                  <span>Nom: {aboutInfo?.fullName || 'IBRAHIMA'}</span>
                </InfoItem>
                <InfoItem>
                  <FaGraduationCap />
                  <span>Titre: {aboutInfo?.title || 'Fullstack'}</span>
                </InfoItem>
                <InfoItem>
                  <FaCode />
                  <span>Spécialités: {Array.isArray(aboutInfo?.specialties) ? aboutInfo.specialties.join(', ') : aboutInfo?.specialties || 'dev, web, mobile, embarquer'}</span>
                </InfoItem>
              </InfoList>
              <Button to="/contact" variant="primary" style={{ marginTop: '1rem' }}>
                Me Contacter
              </Button>
            </ProfileContainer>
            
            <ContentContainer>
              <Name>{aboutInfo?.fullName || 'IBRAHIMA SORY DIALLO'}</Name>
              <JobTitle>{aboutInfo?.title || 'Développeur Web et Mobile Full Stack'}</JobTitle>
              
              <BioText dangerouslySetInnerHTML={{ __html: aboutInfo?.bio || aboutInfo?.content || 'Je suis IBRAHIMA SORY DIALLO, étudiant en génie logiciel à IAM DAKAR, développeur web et mobile full stack avec plus de 3 ans d\'expérience dans la création d\'applications modernes. J\'aime résoudre des problèmes complexes et créer des expériences utilisateur intuitives. J\'adore traduire mes idée abstraites en application mobile ou web. Je suis autonome, autodidact' }} />
              
              <Formation>
                <SectionTitle>Formation</SectionTitle>
                <FormationItem>
                  <FormationDetails>
                    <FormationTitle>Licence en Informatique</FormationTitle>
                    <FormationPlace>IAM DAKAR</FormationPlace>
                  </FormationDetails>
                  <FormationYear>2025</FormationYear>
                </FormationItem>
              </Formation>
              
              <Button to="/contact" variant="primary">
                Me contacter
              </Button>
            </ContentContainer>
          </AboutSection>
          
          <SkillsContainer>
            <SectionTitle>Compétences</SectionTitle>
            <SkillsList>
              {Object.entries(skillsByCategory).length > 0 ? 
                Object.entries(skillsByCategory).flatMap(([category, skills]) => 
                  skills.map((skill, index) => (
                    <SkillItem key={`${category}-${index}`}>
                      <SkillName>
                        <span>{skill.name || 'dev'}</span>
                        <span>{skill.level || 80}%</span>
                      </SkillName>
                      <ProgressBar>
                        <Progress value={skill.level || 80} />
                      </ProgressBar>
                    </SkillItem>
                  ))
                ) : (
                  // Compétences par défaut si aucune n'est définie
                  <>
                    <SkillItem>
                      <SkillName>
                        <span>dev</span>
                        <span>80%</span>
                      </SkillName>
                      <ProgressBar>
                        <Progress value={80} />
                      </ProgressBar>
                    </SkillItem>
                    <SkillItem>
                      <SkillName>
                        <span>web</span>
                        <span>80%</span>
                      </SkillName>
                      <ProgressBar>
                        <Progress value={80} />
                      </ProgressBar>
                    </SkillItem>
                    <SkillItem>
                      <SkillName>
                        <span>mobile</span>
                        <span>80%</span>
                      </SkillName>
                      <ProgressBar>
                        <Progress value={80} />
                      </ProgressBar>
                    </SkillItem>
                    <SkillItem>
                      <SkillName>
                        <span>embarquer</span>
                        <span>80%</span>
                      </SkillName>
                      <ProgressBar>
                        <Progress value={80} />
                      </ProgressBar>
                    </SkillItem>
                  </>
                )
              }
            </SkillsList>
          </SkillsContainer>
        </motion.div>
      ) : (
        <ErrorMessage>Aucune information disponible pour le moment.</ErrorMessage>
      )}
    </PageContainer>
  );
};

export default AboutPage;
