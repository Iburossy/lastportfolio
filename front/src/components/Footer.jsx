import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: #222;
  color: #fff;
  padding: 2rem 0;
  margin-top: 3rem;
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
  margin-bottom: 1rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary);
`;

const FooterLink = styled(Link)`
  display: block;
  color: #ccc;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: var(--transition);
  
  &:hover {
    color: var(--primary);
  }
`;

const FooterText = styled.p`
  color: #ccc;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  color: #ccc;
  font-size: 1.5rem;
  transition: var(--transition);
  
  &:hover {
    color: var(--primary);
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid #444;
  color: #888;
  font-size: 0.9rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>MonPortfolio</FooterTitle>
          <FooterText>
            Portfolio personnel présentant mes projets, compétences et expériences.
            Contactez-moi pour toute opportunité de collaboration.
          </FooterText>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Navigation</FooterTitle>
          <FooterLink to="/">Accueil</FooterLink>
          <FooterLink to="/about">À Propos</FooterLink>
          <FooterLink to="/projects">Projets</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Contact</FooterTitle>
          <FooterText>Email: contact@monportfolio.com</FooterText>
          <FooterText>Localisation: Paris, France</FooterText>
          <SocialLinks>
            <SocialIcon href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </SocialIcon>
            <SocialIcon href="https://github.com" target="_blank" rel="noreferrer">
              <FaGithub />
            </SocialIcon>
            <SocialIcon href="mailto:contact@monportfolio.com">
              <FaEnvelope />
            </SocialIcon>
          </SocialLinks>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        &copy; {currentYear} MonPortfolio. Tous droits réservés.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
