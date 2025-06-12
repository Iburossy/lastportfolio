import React from 'react';
import styled from 'styled-components';
import ContactInfoForm from '../../admin/ContactInfoForm';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  color: #333;
  font-size: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ContactInfoPage = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/admin');
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Gérer les Informations de Contact</PageTitle>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Retour au Dashboard
        </BackButton>
      </PageHeader>
      <ContactInfoForm />
    </PageContainer>
  );
};

export default ContactInfoPage;
