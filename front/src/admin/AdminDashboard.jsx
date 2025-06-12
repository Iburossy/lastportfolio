import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaProjectDiagram, 
  FaUser, 
  FaEnvelope, 
  FaPlus, 
  FaSignOutAlt,
  FaEdit,
  FaAddressCard,
  FaHome,
  FaList
} from 'react-icons/fa';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import projectService from '../services/projectService';
import contactService from '../services/contactService';
import authService from '../services/authService';

// Styles
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const DashboardTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.$primary ? 'var(--primary)' : 'var(--secondary)'};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.$primary ? 'var(--primary-dark)' : '#5a6268'};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--error);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #c82333;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatsCard = styled(motion.div)`
  background-color: var(--paper);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const StatsHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatsIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background-color: ${props => 
    props.$primary ? 'rgba(0, 112, 243, 0.1)' : 
    props.$success ? 'rgba(40, 167, 69, 0.1)' : 
    props.$warning ? 'rgba(255, 193, 7, 0.1)' : 
    'rgba(108, 117, 125, 0.1)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.5rem;
  color: ${props => 
    props.$primary ? 'var(--primary)' : 
    props.$success ? 'var(--success)' : 
    props.$warning ? '#ffc107' : 
    'var(--secondary)'
  };
`;

const StatsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const StatsValue = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
`;

const StatsFooter = styled.div`
  margin-top: auto;
`;

const StatsLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: var(--primary);
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-left: 0.5rem;
    font-size: 0.875rem;
  }
`;

const RecentSectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
`;

const TableContainer = styled.div`
  background-color: var(--paper);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-bottom: 3rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
`;

const TableHeadCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid #e9ecef;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  color: ${props => props.highlight ? 'var(--primary)' : 'var(--text-primary)'};
  font-weight: ${props => props.bold ? '600' : 'normal'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

const ActionLink = styled(Link)`
  color: ${props => props.delete ? 'var(--error)' : 'var(--primary)'};
  margin-right: 1rem;
  transition: var(--transition);
  
  &:hover {
    opacity: 0.8;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    projectsCount: 0,
    messagesCount: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Charger les projets
        const projectsResponse = await projectService.getAllProjects();
        const projects = projectsResponse.data || [];
        
        // Charger les messages
        const messagesResponse = await contactService.getAllMessages();
        const messages = messagesResponse.data || [];
        
        // Mettre à jour les statistiques
        setStats({
          projectsCount: projects.length,
          messagesCount: messages.length
        });
        
        // Trier les projets par date de mise à jour et prendre les 5 derniers
        const sortedProjects = [...projects].sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        ).slice(0, 5);
        
        setRecentProjects(sortedProjects);
        
        // Trier les messages par date d'envoi et prendre les 5 derniers
        const sortedMessages = [...messages].sort((a, b) => 
          new Date(b.sent_at) - new Date(a.sent_at)
        ).slice(0, 5);
        
        setRecentMessages(sortedMessages);
      } catch (err) {
        console.error('Erreur lors du chargement des données du dashboard:', err);
        setError('Impossible de charger les données du dashboard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };
  
  if (loading) {
    return <Loader fullScreen text="Chargement du dashboard..." />;
  }
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Dashboard Administrateur</DashboardTitle>
        <ActionsContainer>
          <ActionButton to="/admin/projects" $secondary>
            <FaList /> Liste des Projets
          </ActionButton>
          <ActionButton to="/admin/projects/new" $primary>
            <FaPlus /> Nouveau Projet
          </ActionButton>
          <ActionButton to="/admin/about">
            <FaEdit /> Éditer À Propos
          </ActionButton>
          <ActionButton to="/admin/intro">
            <FaHome /> Gérer Introduction
          </ActionButton>
          <ActionButton to="/admin/contact-info">
            <FaAddressCard /> Gérer Contacts
          </ActionButton>
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt /> Déconnexion
          </LogoutButton>
        </ActionsContainer>
      </DashboardHeader>
      
      {error && (
        <Alert 
          type="error" 
          title="Erreur" 
          message={error} 
          onClose={() => setError(null)}
        />
      )}
      
      <DashboardGrid>
        <StatsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatsHeader>
            <StatsIcon $primary>
              <FaProjectDiagram />
            </StatsIcon>
            <StatsTitle>Projets</StatsTitle>
          </StatsHeader>
          <StatsValue>{stats.projectsCount}</StatsValue>
          <StatsFooter>
            <StatsLink to="/admin/projects/new">
              Ajouter un projet
              <FaPlus />
            </StatsLink>
          </StatsFooter>
        </StatsCard>
        
        <StatsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatsHeader>
            <StatsIcon success>
              <FaEnvelope />
            </StatsIcon>
            <StatsTitle>Messages</StatsTitle>
          </StatsHeader>
          <StatsValue>{stats.messagesCount}</StatsValue>
          <StatsFooter>
            <StatsLink to="/admin/messages">
              Voir tous les messages
            </StatsLink>
          </StatsFooter>
        </StatsCard>
        
        <StatsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatsHeader>
            <StatsIcon warning>
              <FaUser />
            </StatsIcon>
            <StatsTitle>Profil</StatsTitle>
          </StatsHeader>
          <StatsValue>1</StatsValue>
          <StatsFooter>
            <StatsLink to="/admin/about">
              Mettre à jour votre profil
            </StatsLink>
          </StatsFooter>
        </StatsCard>
      </DashboardGrid>
      
      <section>
        <RecentSectionTitle>Projets Récents</RecentSectionTitle>
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeadCell>Titre</TableHeadCell>
                <TableHeadCell>Technologies</TableHeadCell>
                <TableHeadCell>Date de modification</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </tr>
            </TableHead>
            <tbody>
              {recentProjects.length > 0 ? (
                recentProjects.map(project => (
                  <TableRow key={project.id}>
                    <TableCell bold>{project.title}</TableCell>
                    <TableCell>
                      {project.technologies && project.technologies.join(', ')}
                    </TableCell>
                    <TableCell>
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <ActionLink to={`/admin/projects/${project.id}/edit`}>
                        <FaEdit />
                      </ActionLink>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <EmptyState>Aucun projet disponible.</EmptyState>
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </TableContainer>
      </section>
      
      <section>
        <RecentSectionTitle>Messages Récents</RecentSectionTitle>
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeadCell>Nom</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>Message</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
              </tr>
            </TableHead>
            <tbody>
              {recentMessages.length > 0 ? (
                recentMessages.map(message => (
                  <TableRow key={message.id}>
                    <TableCell bold>{message.name}</TableCell>
                    <TableCell highlight>{message.email}</TableCell>
                    <TableCell>{message.message}</TableCell>
                    <TableCell>
                      {new Date(message.sent_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <EmptyState>Aucun message disponible.</EmptyState>
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </TableContainer>
        <ActionButton to="/admin/messages" style={{ marginTop: '1rem' }}>
          Voir tous les messages
        </ActionButton>
      </section>
    </DashboardContainer>
  );
};

export default AdminDashboard;
