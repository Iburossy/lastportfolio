import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaCode, FaTools, FaGraduationCap, FaServer, FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Button from '../components/Button';
import Loader from '../components/Loader';
import aboutService from '../services/aboutService';
import experienceService from '../services/experienceService';

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
  background-color: #fff;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
`;

const SkillCategory = styled.div`
  margin-bottom: 1.5rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary);
  display: inline-block;
`;

const SkillsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SkillItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: var(--text-primary);
  
  &:before {
    content: '•';
    color: var(--primary);
    font-size: 1.5rem;
    margin-right: 0.5rem;
    line-height: 0.75;
  }
`;

// Styles pour les expériences professionnelles
const ExperiencesContainer = styled.section`
  background-color: #fff;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
`;

const ExperiencesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1.5rem;
`;

const ExperienceItem = styled.div`
  position: relative;
  padding-left: 2rem;
  padding-bottom: 2rem;
  border-left: 2px solid var(--primary);
  
  &:last-child {
    padding-bottom: 0;
    border-left-color: transparent;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: var(--primary);
  }
`;

const ExperienceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ExperienceTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const ExperienceCompany = styled.h4`
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--primary);
  margin: 0.25rem 0;
`;

const ExperienceDate = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  background-color: #f0f4f8;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ExperienceDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0.5rem 0;
`;

const ExperienceDetail = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ExperienceDescription = styled.p`
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.6;
  margin-top: 0.75rem;
  white-space: pre-line;
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
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les données du profil
        const aboutResponse = await aboutService.getAbout();
        console.log('Réponse complète du backend (about):', aboutResponse);
        setAboutData(aboutResponse);
        
        // Charger les expériences professionnelles
        const experiencesResponse = await experienceService.getAllExperiences();
        console.log('Réponse complète du backend (experiences):', experiencesResponse);
        
        if (experiencesResponse && experiencesResponse.data) {
          // Trier les expériences par date (plus récentes d'abord)
          const sortedExperiences = experiencesResponse.data.sort((a, b) => {
            return new Date(b.startDate) - new Date(a.startDate);
          });
          
          setExperiences(sortedExperiences);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les informations. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
            <SectionTitle>Mes compétences</SectionTitle>
            <SkillsGrid>
              {Object.entries(skillsByCategory).length > 0 ? 
                Object.entries(skillsByCategory).map(([category, skills]) => (
                  <SkillCategory key={category}>
                    <CategoryTitle>{category}</CategoryTitle>
                    <SkillsList>
                      {skills.map((skill, index) => (
                        <SkillItem key={`${category}-${index}`}>
                          {skill.name}
                        </SkillItem>
                      ))}
                    </SkillsList>
                  </SkillCategory>
                )) : (
                  // Catégories par défaut si aucune n'est définie
                  <>
                    <SkillCategory>
                      <CategoryTitle>Frontend</CategoryTitle>
                      <SkillsList>
                        <SkillItem>React</SkillItem>
                        <SkillItem>Flutter</SkillItem>
                        <SkillItem>HTML5</SkillItem>
                        <SkillItem>CSS3</SkillItem>
                        <SkillItem>Bootstrap</SkillItem>
                        <SkillItem>Tailwind</SkillItem>
                        <SkillItem>Tkinter</SkillItem>
                        <SkillItem>Kivy md</SkillItem>
                        <SkillItem>.Net</SkillItem>
                      </SkillsList>
                    </SkillCategory>
                    
                    <SkillCategory>
                      <CategoryTitle>Backend</CategoryTitle>
                      <SkillsList>
                        <SkillItem>Node.js</SkillItem>
                        <SkillItem>Express</SkillItem>
                        <SkillItem>MongoDB</SkillItem>
                        <SkillItem>Firebase</SkillItem>
                        <SkillItem>Laravel</SkillItem>
                        <SkillItem>Mysql</SkillItem>
                      </SkillsList>
                    </SkillCategory>
                    
                    <SkillCategory>
                      <CategoryTitle>DevOps / Cloud / Infrastructure</CategoryTitle>
                      <SkillsList>
                        <SkillItem>Google cloid platform</SkillItem>
                        <SkillItem>Firebase</SkillItem>
                        <SkillItem>studio 3T</SkillItem>
                        <SkillItem>rabbitmq</SkillItem>
                      </SkillsList>
                    </SkillCategory>
                    
                    <SkillCategory>
                      <CategoryTitle>Outils</CategoryTitle>
                      <SkillsList>
                        <SkillItem>Git</SkillItem>
                        <SkillItem>Android studio</SkillItem>
                      </SkillsList>
                    </SkillCategory>
                  </>
                )
              }
            </SkillsGrid>
          </SkillsContainer>
          
          <ExperiencesContainer>
            <SectionTitle>
              <FaBriefcase style={{ marginRight: '0.5rem' }} />
              Expériences Professionnelles
            </SectionTitle>
            
            {experiences && experiences.length > 0 ? (
              <ExperiencesList>
                {experiences.map((experience, index) => {
                  // Formater les dates
                  const startDate = new Date(experience.startDate);
                  const formattedStartDate = startDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                  
                  let formattedEndDate = 'Présent';
                  if (!experience.current && experience.endDate) {
                    const endDate = new Date(experience.endDate);
                    formattedEndDate = endDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                  }
                  
                  return (
                    <ExperienceItem key={index}>
                      <ExperienceHeader>
                        <div>
                          <ExperienceTitle>{experience.title}</ExperienceTitle>
                          <ExperienceCompany>{experience.company}</ExperienceCompany>
                        </div>
                        <ExperienceDate>
                          <FaCalendarAlt />
                          {formattedStartDate} - {formattedEndDate}
                        </ExperienceDate>
                      </ExperienceHeader>
                      
                      {experience.location && (
                        <ExperienceDetails>
                          <ExperienceDetail>
                            <FaMapMarkerAlt />
                            {experience.location}
                          </ExperienceDetail>
                        </ExperienceDetails>
                      )}
                      
                      {experience.description && (
                        <ExperienceDescription>
                          {experience.description}
                        </ExperienceDescription>
                      )}
                    </ExperienceItem>
                  );
                })}
              </ExperiencesList>
            ) : (
              <p>Aucune expérience professionnelle n'a été ajoutée.</p>
            )}
          </ExperiencesContainer>
        </motion.div>
      ) : (
        <ErrorMessage>Aucune information disponible pour le moment.</ErrorMessage>
      )}
    </PageContainer>
  );
};

export default AboutPage;
