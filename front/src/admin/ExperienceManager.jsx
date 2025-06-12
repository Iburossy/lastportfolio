import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';
import Button from '../components/Button';
import Loader from '../components/Loader';
import ExperiencesList from './ExperiencesList';
import experienceService from '../services/experienceService';

// Styles
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
`;

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await experienceService.getAllExperiences();
        setExperiences(response.data || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des expériences:', err);
        setError('Impossible de charger les expériences professionnelles.');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return <Loader fullScreen text="Chargement des expériences..." />;
  }

  return (
    <Container>
      <Header>
        <Title>Gestion des expériences professionnelles</Title>
        <Button as={Link} to="/admin/experiences/new">
          <FaPlus /> Ajouter une expérience
        </Button>
      </Header>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <ExperiencesList 
          experiences={experiences}
          onExperiencesChange={setExperiences}
        />
      )}
    </Container>
  );
};

export default ExperienceManager;
