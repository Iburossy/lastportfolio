import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaLinkedin, FaGithub, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import contactService from '../services/contactService';
import contactInfoService from '../services/contactInfoService';

// Styles
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto 3rem;
  text-align: center;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled.div`
  background-color: var(--paper);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
`;

const InfoTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
`;

const InfoItem = styled.li`
  display: flex;
  margin-bottom: 1.5rem;
`;

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgba(0, 112, 243, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  margin-right: 1rem;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.h4`
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
`;

const InfoText = styled.p`
  color: var(--text-secondary);
`;

const ContactForm = styled(motion.form)`
  background-color: var(--paper);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
`;

const FormTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
  
  &.full-width {
    grid-column: 1 / -1;
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
  min-height: 150px;
  
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

const SubmitButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    twitter: '',
    facebook: '',
    instagram: ''
  });
  const [loading, setLoading] = useState(true);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm();
  
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await contactInfoService.getContactInfo();
        if (response.success && response.data) {
          setContactInfo(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des informations de contact:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      await contactService.sendMessage(data);
      
      setAlert({
        type: 'success',
        title: 'Message envoyé !',
        message: 'Merci pour votre message. Je vous répondrai dans les plus brefs délais.'
      });
      
      reset();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      setAlert({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAlertClose = () => {
    setAlert(null);
  };
  
  return (
    <PageContainer>
      <PageTitle>Contact</PageTitle>
      <PageDescription>
        Vous avez une question ou vous souhaitez travailler ensemble ? 
        N'hésitez pas à me contacter !
      </PageDescription>
      
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={handleAlertClose}
          autoClose={true}
          fixed={true}
        />
      )}
      
      <ContactGrid>
        <ContactInfo>
          <InfoTitle>Informations de contact</InfoTitle>
          {loading ? (
            <Loader text="Chargement des informations de contact..." />
          ) : (
            <InfoList>
              {contactInfo.email && (
                <InfoItem>
                  <InfoIcon>
                    <FaEnvelope />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Email</InfoLabel>
                    <InfoText>
                      <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                    </InfoText>
                  </InfoContent>
                </InfoItem>
              )}
              
              {contactInfo.phone && (
                <InfoItem>
                  <InfoIcon>
                    <FaPhone />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Téléphone</InfoLabel>
                    <InfoText>
                      <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}>{contactInfo.phone}</a>
                    </InfoText>
                  </InfoContent>
                </InfoItem>
              )}
              
              {contactInfo.address && (
                <InfoItem>
                  <InfoIcon>
                    <FaMapMarkerAlt />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Localisation</InfoLabel>
                    <InfoText>{contactInfo.address}</InfoText>
                  </InfoContent>
                </InfoItem>
              )}
              
              {/* Réseaux sociaux */}
              {contactInfo.linkedin && (
                <InfoItem>
                  <InfoIcon>
                    <FaLinkedin />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>LinkedIn</InfoLabel>
                    <InfoText>
                      <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer">Profil LinkedIn</a>
                    </InfoText>
                  </InfoContent>
                </InfoItem>
              )}
              
              {contactInfo.github && (
                <InfoItem>
                  <InfoIcon>
                    <FaGithub />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>GitHub</InfoLabel>
                    <InfoText>
                      <a href={contactInfo.github} target="_blank" rel="noopener noreferrer">Profil GitHub</a>
                    </InfoText>
                  </InfoContent>
                </InfoItem>
              )}
              
              {contactInfo.twitter && (
                <InfoItem>
                  <InfoIcon>
                    <FaTwitter />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Twitter</InfoLabel>
                    <InfoText>
                      <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer">Profil Twitter</a>
                    </InfoText>
                  </InfoContent>
                </InfoItem>
              )}
              
              {contactInfo.facebook && (
                <InfoItem>
                  <InfoIcon>
                    <FaFacebook />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Facebook</InfoLabel>
                    <InfoText>
                      <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer">Profil Facebook</a>
                    </InfoText>
                  </InfoContent>
                </InfoItem>
              )}
              
              {contactInfo.instagram && (
                <InfoItem>
                  <InfoIcon>
                    <FaInstagram />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Instagram</InfoLabel>
                    <InfoText>
                      <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer">Profil Instagram</a>
                    </InfoText>
                  </InfoContent>
                </InfoItem>
              )}
            </InfoList>
          )}
        </ContactInfo>
        
        <ContactForm
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FormTitle>Envoyez-moi un message</FormTitle>
          
          <FormGrid>
            <FormField>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                type="text"
                error={errors.name}
                {...register('name', { required: 'Le nom est requis' })}
                disabled={isSubmitting}
              />
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </FormField>
            
            <FormField>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                error={errors.email}
                {...register('email', { 
                  required: 'L\'email est requis',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Adresse email invalide'
                  }
                })}
                disabled={isSubmitting}
              />
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
            </FormField>
            
            <FormField className="full-width">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                error={errors.message}
                {...register('message', { 
                  required: 'Le message est requis',
                  minLength: {
                    value: 10,
                    message: 'Le message doit contenir au moins 10 caractères'
                  }
                })}
                disabled={isSubmitting}
              />
              {errors.message && (
                <ErrorMessage>{errors.message.message}</ErrorMessage>
              )}
            </FormField>
          </FormGrid>
          
          <SubmitButton 
            type="submit" 
            $fullWidth 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader size="20px" />
                Envoi en cours...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Envoyer le message
              </>
            )}
          </SubmitButton>
        </ContactForm>
      </ContactGrid>
    </PageContainer>
  );
};

export default ContactPage;
