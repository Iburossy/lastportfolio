import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import contactInfoService from '../services/contactInfoService';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const FormContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const Label = styled.label`
  font-weight: 500;
  color: #444;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  flex-grow: 1;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #f0f0f0;
  border-radius: 4px;
  color: #555;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SubmitButton = styled(Button)`
  background-color: #2684ff;
  color: white;

  &:hover {
    background-color: #1a73e8;
  }
`;

const ResetButton = styled(Button)`
  background-color: #f0f0f0;
  color: #333;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ContactInfoForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    twitter: '',
    facebook: '',
    instagram: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const response = await contactInfoService.getContactInfo();
        if (response.success && response.data) {
          setFormData(response.data);
          setInitialData(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des informations de contact:', error);
        setAlert({
          type: 'error',
          title: 'Erreur',
          message: 'Impossible de charger les informations de contact'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await contactInfoService.updateContactInfo(formData);
      
      if (response.success) {
        setAlert({
          type: 'success',
          title: 'Succès',
          message: 'Informations de contact mises à jour avec succès'
        });
        setInitialData(formData);
      } else {
        setAlert({
          type: 'error',
          title: 'Erreur',
          message: 'Erreur lors de la mise à jour des informations'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setAlert({
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors de la mise à jour des informations'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAlertClose = () => {
    setAlert(null);
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
    }
  };

  return (
    <FormContainer>
      <Title>Informations de Contact</Title>
      
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={handleAlertClose}
        />
      )}
      
      {loading ? (
        <Loader text="Chargement des informations de contact..." />
      ) : (
        <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <InputGroup>
            <IconWrapper>
              <FaEnvelope />
            </IconWrapper>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Votre email professionnel"
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Téléphone</Label>
          <InputGroup>
            <IconWrapper>
              <FaPhone />
            </IconWrapper>
            <Input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Votre numéro de téléphone"
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="address">Adresse</Label>
          <InputGroup>
            <IconWrapper>
              <FaMapMarkerAlt />
            </IconWrapper>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Votre adresse ou localisation"
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <InputGroup>
            <IconWrapper>
              <FaLinkedin />
            </IconWrapper>
            <Input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="URL de votre profil LinkedIn"
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="github">GitHub</Label>
          <InputGroup>
            <IconWrapper>
              <FaGithub />
            </IconWrapper>
            <Input
              type="url"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="URL de votre profil GitHub"
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="twitter">Twitter</Label>
          <InputGroup>
            <IconWrapper>
              <FaTwitter />
            </IconWrapper>
            <Input
              type="url"
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="URL de votre profil Twitter"
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="facebook">Facebook</Label>
          <InputGroup>
            <IconWrapper>
              <FaFacebook />
            </IconWrapper>
            <Input
              type="url"
              id="facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="URL de votre profil Facebook"
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="instagram">Instagram</Label>
          <InputGroup>
            <IconWrapper>
              <FaInstagram />
            </IconWrapper>
            <Input
              type="url"
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="URL de votre profil Instagram"
            />
          </InputGroup>
        </FormGroup>

        <ButtonGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </SubmitButton>
          <ResetButton type="button" onClick={handleReset}>
            Réinitialiser
          </ResetButton>
        </ButtonGroup>
      </Form>
      )}
    </FormContainer>
  );
};

export default ContactInfoForm;
