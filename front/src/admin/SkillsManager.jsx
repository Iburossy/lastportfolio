import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaSync } from 'react-icons/fa';
import skillService from '../services/skillService';
import Loader from '../components/Loader';

// Styles
const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  background-color: ${props => {
    if (props.variant === 'primary') return 'var(--primary)';
    if (props.variant === 'danger') return 'var(--error)';
    if (props.variant === 'secondary') return '#6c757d';
    return '#e9ecef';
  }};
  
  color: ${props => {
    if (props.variant === 'primary' || props.variant === 'danger' || props.variant === 'secondary') return 'white';
    return 'var(--text-primary)';
  }};
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SkillsContainer = styled.div`
  margin-bottom: 2rem;
`;

const SkillsList = styled.div`
  margin-top: 1rem;
  border: 1px solid #e1e1e1;
  border-radius: var(--border-radius);
  overflow: hidden;
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const AddCategoryButton = styled(Button)`
  margin-top: 1rem;
  width: 100%;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e1e1e1;
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: white;
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Option = styled.option`
  padding: 0.5rem;
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  background-color: #ffebee;
  color: var(--error);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--error);
`;

const RefreshButton = styled(Button)`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
`;

const AddForm = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: var(--border-radius);
`;

const FormTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  color: var(--text-primary);
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;


const SkillItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e1e1e1;
  background-color: ${props => props.isEditing ? '#f8f9fa' : 'white'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SkillName = styled.div`
  flex: 2;
  font-weight: ${props => props.isEditing ? '600' : '400'};
`;

const SkillLevel = styled.div`
  flex: 1;
  text-align: center;
`;

const SkillCategory = styled.div`
  flex: 1;
  color: var(--text-secondary);
`;

const SkillActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.color || 'var(--text-secondary)'};
  cursor: pointer;
  transition: var(--transition);
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.hoverColor || 'var(--primary)'};
  }
`;

const AddSkillForm = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: var(--border-radius);
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const FormField = styled.div`
  flex: ${props => props.flex || 1};
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
  border: 1px solid #e1e1e1;
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RangeValue = styled.div`
  text-align: center;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const AddButton = styled(Button)`
  margin-top: 1rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const SkillsManager = ({ skills = [], onChange }) => {
  const [skillsList, setSkillsList] = useState(skills);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSkillIndex, setEditingSkillIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 80,
    category: '',
    order: 0
  });
  
  // Charger les compétences depuis l'API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await skillService.getAllSkills();
        if (response && response.data) {
          setSkillsList(response.data);
          // Vérifier si onChange est une fonction avant de l'appeler
          if (typeof onChange === 'function') {
            onChange(response.data);
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement des compétences:', err);
        setError('Impossible de charger les compétences');
      } finally {
        setLoading(false);
      }
    };

    // Si aucune compétence n'est fournie, charger depuis l'API
    if (skills.length === 0) {
      fetchSkills();
    }
  }, []);

  // Charger les catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await skillService.getAllCategories();
        if (response && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        // Utiliser des catégories par défaut en cas d'erreur
        setCategories(['Frontend', 'Backend', 'DevOps / Cloud / Infrastructure', 'Outils']);
      }
    };

    fetchCategories();
  }, []);

  // Grouper les compétences par catégorie
  const skillsByCategory = skillsList.reduce((acc, skill) => {
    const category = skill.category || 'Autres';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  // Gérer l'ajout d'une compétence
  const handleAddSkill = async () => {
    if (!newSkill.name.trim() || !newSkill.category.trim()) return;
    
    try {
      setLoading(true);
      // Ajouter l'ordre si non défini
      const skillToAdd = {
        ...newSkill,
        order: newSkill.order || skillsList.length + 1
      };
      
      // Appel à l'API pour créer la compétence
      const response = await skillService.createSkill(skillToAdd);
      
      if (response && response.data) {
        const updatedSkills = [...skillsList, response.data];
        setSkillsList(updatedSkills);
        if (typeof onChange === 'function') {
          onChange(updatedSkills);
        }
        
        // Réinitialiser le formulaire
        setNewSkill({
          name: '',
          level: 80,
          category: selectedCategory || '',
          order: 0
        });
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la compétence:', err);
      setError('Impossible d\'ajouter la compétence');
    } finally {
      setLoading(false);
    }
  };
  
  // Gérer l'ajout d'une nouvelle catégorie
  const handleAddCategory = (newCategory) => {
    if (!newCategory.trim() || categories.includes(newCategory)) return;
    setCategories([...categories, newCategory]);
    setSelectedCategory(newCategory);
    setNewSkill({
      ...newSkill,
      category: newCategory
    });
  };

  // Gérer la suppression d'une compétence
  const handleDeleteSkill = async (index) => {
    const skillToDelete = skillsList[index];
    
    try {
      setLoading(true);
      // Appel à l'API pour supprimer la compétence
      await skillService.deleteSkill(skillToDelete.id);
      
      const updatedSkills = skillsList.filter((_, i) => i !== index);
      setSkillsList(updatedSkills);
      if (typeof onChange === 'function') {
        onChange(updatedSkills);
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de la compétence:', err);
      setError('Impossible de supprimer la compétence');
    } finally {
      setLoading(false);
    }
  };

  // Commencer l'édition d'une compétence
  const handleStartEditing = (index) => {
    setEditingSkillIndex(index);
    setNewSkill({ ...skillsList[index] });
  };

  // Annuler l'édition
  const handleCancelEditing = () => {
    setEditingSkillIndex(null);
    setNewSkill({
      name: '',
      level: 80,
      category: ''
    });
  };

  // Sauvegarder les modifications d'une compétence
  const handleSaveEditing = async () => {
    if (!newSkill.name.trim() || editingSkillIndex === null) return;
    
    try {
      setLoading(true);
      const skillToUpdate = {
        ...newSkill,
        id: skillsList[editingSkillIndex].id
      };
      
      // Appel à l'API pour mettre à jour la compétence
      const response = await skillService.updateSkill(skillToUpdate.id, skillToUpdate);
      
      if (response && response.data) {
        const updatedSkills = [...skillsList];
        updatedSkills[editingSkillIndex] = response.data;
        
        setSkillsList(updatedSkills);
        if (typeof onChange === 'function') {
          onChange(updatedSkills);
        }
        setEditingSkillIndex(null);
        
        // Réinitialiser le formulaire
        setNewSkill({
          name: '',
          level: 80,
          category: '',
          order: 0
        });
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la compétence:', err);
      setError('Impossible de mettre à jour la compétence');
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchir les compétences depuis l'API
  const refreshSkills = async () => {
    try {
      setLoading(true);
      const response = await skillService.getAllSkills();
      if (response && response.data) {
        setSkillsList(response.data);
        if (typeof onChange === 'function') {
          onChange(response.data);
        }
      }
    } catch (err) {
      console.error('Erreur lors du rafraîchissement des compétences:', err);
      setError('Impossible de rafraîchir les compétences');
    } finally {
      setLoading(false);
    }
  };

  // Effacer le message d'erreur
  const clearError = () => {
    setError(null);
  };

  return (
    <SkillsContainer>
      {/* Affichage du chargement et des erreurs */}
      {loading && <Loader size="40px" text="Chargement des compétences..." />}
      
      {error && (
        <ErrorMessage>
          {error}
          <ActionButton onClick={clearError}>
            <FaTimes />
          </ActionButton>
        </ErrorMessage>
      )}
      
      {/* Bouton de rafraîchissement */}
      <RefreshButton onClick={refreshSkills} disabled={loading}>
        <FaSync /> Rafraîchir les compétences
      </RefreshButton>
      
      {/* Affichage des compétences par catégorie */}
      {Object.keys(skillsByCategory).length > 0 ? (
        <>
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <CategorySection key={category}>
              <CategoryHeader>
                <CategoryTitle>{category}</CategoryTitle>
                <ActionButton 
                  onClick={() => {
                    setSelectedCategory(category);
                    setNewSkill({...newSkill, category: category});
                    setShowAddForm(true);
                  }}
                >
                  <FaPlus /> Ajouter une compétence
                </ActionButton>
              </CategoryHeader>
              
              <SkillsList>
                {skills.map((skill, index) => {
                  const globalIndex = skillsList.findIndex(s => s.name === skill.name && s.category === skill.category);
                  return (
                    <SkillItem key={`${category}-${index}`} isEditing={editingSkillIndex === globalIndex}>
                      {editingSkillIndex === globalIndex ? (
                        <>
                          <SkillName isEditing>
                            <Input
                              type="text"
                              value={newSkill.name}
                              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                              placeholder="Nom de la compétence"
                            />
                          </SkillName>
                          <SkillLevel>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={newSkill.level}
                              onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) || 0 })}
                            />
                          </SkillLevel>
                          <SkillCategory>
                            <Select
                              value={newSkill.category}
                              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                            >
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                              <option value="Autres">Autres</option>
                            </Select>
                          </SkillCategory>
                          <SkillActions>
                            <ActionButton color="var(--primary)" hoverColor="var(--primary-dark)" onClick={handleSaveEditing}>
                              <FaSave />
                            </ActionButton>
                            <ActionButton color="var(--error)" hoverColor="#d32f2f" onClick={handleCancelEditing}>
                              <FaTimes />
                            </ActionButton>
                          </SkillActions>
                        </>
                      ) : (
                        <>
                          <SkillName>{skill.name}</SkillName>
                          <SkillLevel>{skill.level}%</SkillLevel>
                          <SkillActions>
                            <ActionButton onClick={() => handleStartEditing(globalIndex)}>
                              <FaEdit />
                            </ActionButton>
                            <ActionButton color="var(--error)" hoverColor="#d32f2f" onClick={() => handleDeleteSkill(globalIndex)}>
                              <FaTrash />
                            </ActionButton>
                          </SkillActions>
                        </>
                      )}
                    </SkillItem>
                  );
                })}
              </SkillsList>
            </CategorySection>
          ))}
        </>
      ) : (
        <EmptyState>
          <p>Aucune compétence ajoutée pour le moment.</p>
          <Button onClick={() => setShowAddForm(true)}>
            <FaPlus /> Ajouter une compétence
          </Button>
        </EmptyState>
      )}

      {/* Bouton pour ajouter une nouvelle catégorie */}
      <AddCategoryButton onClick={() => setShowAddForm(true)}>
        <FaPlus /> Ajouter une nouvelle compétence
      </AddCategoryButton>

      {!showAddForm ? (
        <AddButton onClick={() => setShowAddForm(true)}>
          <FaPlus /> Ajouter une compétence
        </AddButton>
      ) : (
        <AddForm>
          <FormTitle>Ajouter une compétence</FormTitle>
          <FormGroup>
            <Label>Nom</Label>
            <Input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="Ex: React, Node.js, etc."
            />
          </FormGroup>
          <FormGroup>
            <Label>Niveau (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) || 0 })}
            />
          </FormGroup>
          <FormGroup>
            <Label>Catégorie</Label>
            <Select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            >
              <Option value="">Sélectionner une catégorie</Option>
              {categories.map((category) => (
                <Option key={category} value={category}>{category}</Option>
              ))}
              <Option value="Autres">Autres</Option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Ou ajouter une nouvelle catégorie</Label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input
                type="text"
                placeholder="Nouvelle catégorie"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
              <Button onClick={() => handleAddCategory(selectedCategory)}>
                Ajouter
              </Button>
            </div>
          </FormGroup>
          <ButtonGroup>
            <Button variant="secondary" onClick={() => {
              setShowAddForm(false);
              setNewSkill({
                name: '',
                level: 80,
                category: ''
              });
              setSelectedCategory('');
            }}>
              <FaTimes /> Annuler
            </Button>
            <Button variant="primary" onClick={handleAddSkill} disabled={!newSkill.name.trim()}>
              <FaSave /> Ajouter
            </Button>
          </ButtonGroup>
        </AddForm>
      )}
    </SkillsContainer>
  );
};

export default SkillsManager;
