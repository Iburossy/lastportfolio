import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSave, FaUndo } from 'react-icons/fa';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import introService from '../services/introService';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  color: #333;
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

const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0077cc;
    box-shadow: 0 0 0 2px rgba(0, 119, 204, 0.2);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #0077cc;
    box-shadow: 0 0 0 2px rgba(0, 119, 204, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const SaveButton = styled(Button)`
  background-color: #0077cc;
  color: white;
  
  &:hover {
    background-color: #005fa3;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ResetButton = styled(Button)`
  background-color: #f0f0f0;
  color: #333;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const PreviewSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const PreviewTitle = styled.h3`
  margin-bottom: 1rem;
  color: #333;
`;

const PreviewContent = styled.div`
  padding: 1.5rem;
  background-color: #0077cc;
  color: white;
  border-radius: 4px;
`;

const IntroForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    button_text: '',
    button_link: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [alert, setAlert] = useState(null);
  
  useEffect(() => {
    const fetchIntroData = async () => {
      try {
        setLoading(true);
        const response = await introService.getIntro();
        if (response.success && response.data) {
          setFormData(response.data);
          setInitialData(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des informations d\'introduction:', error);
        setAlert({
          type: 'error',
          title: 'Erreur',
          message: 'Impossible de charger les informations d\'introduction'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIntroData();
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
      const response = await introService.updateIntro(formData);
      
      if (response.success) {
        setAlert({
          type: 'success',
          title: 'Succès',
          message: 'Informations d\'introduction mises à jour avec succès'
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
  
  const hasChanges = initialData && (
    formData.title !== initialData.title ||
    formData.subtitle !== initialData.subtitle ||
    formData.description !== initialData.description ||
    formData.button_text !== initialData.button_text ||
    formData.button_link !== initialData.button_link
  );
  
  return (
    <FormContainer>
      <Title>Personnaliser l'Introduction</Title>
      
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={handleAlertClose}
        />
      )}
      
      {loading ? (
        <Loader text="Chargement des informations d'introduction..." />
      ) : (
        <>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="title">Titre</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="subtitle">Sous-titre</Label>
              <Input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="button_text">Texte du bouton</Label>
              <Input
                type="text"
                id="button_text"
                name="button_text"
                value={formData.button_text || ''}
                onChange={handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="button_link">Lien du bouton</Label>
              <Input
                type="text"
                id="button_link"
                name="button_link"
                value={formData.button_link || ''}
                onChange={handleChange}
                placeholder="ex: /about"
              />
            </FormGroup>
            
            <ButtonGroup>
              <SaveButton 
                type="submit" 
                disabled={loading || !hasChanges}
              >
                <FaSave /> Enregistrer
              </SaveButton>
              
              <ResetButton 
                type="button" 
                onClick={handleReset}
                disabled={loading || !hasChanges}
              >
                <FaUndo /> Réinitialiser
              </ResetButton>
            </ButtonGroup>
          </Form>
          
          <PreviewSection>
            <PreviewTitle>Aperçu</PreviewTitle>
            <PreviewContent>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Bonjour, je suis</h3>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>{formData.title}</h2>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>{formData.subtitle}</p>
              {formData.description && <p style={{ fontSize: '1rem', color: '#666', marginTop: '0.5rem' }}>{formData.description}</p>}
              {formData.button_text && (
                <div style={{ marginTop: '1.5rem' }}>
                  <button style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px' }}>{formData.button_text}</button>
                </div>
              )}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.8rem' }}>G</span>
                </div>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.8rem' }}>L</span>
                </div>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.8rem' }}>T</span>
                </div>
              </div>
            </PreviewContent>
          </PreviewSection>
        </>
      )}
    </FormContainer>
  );
};

export default IntroForm;
