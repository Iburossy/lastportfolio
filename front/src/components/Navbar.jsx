import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';
import authService from '../services/authService';

const Nav = styled.nav`
  background-color: var(--paper);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 1rem 0;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-primary);
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    width: 70%;
    height: 100vh;
    background-color: var(--paper);
    box-shadow: var(--shadow);
    flex-direction: column;
    justify-content: center;
    transition: var(--transition);
    padding: 2rem;
  }
`;

const NavItem = styled.li`
  margin: 0 1rem;
  
  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const NavLinkStyled = styled(NavLink)`
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
  padding: 0.5rem;
  
  &:hover, &.active {
    color: var(--primary);
  }
  
  &.active {
    border-bottom: 2px solid var(--primary);
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const AdminButton = styled(Link)`
  background-color: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  margin-left: 1rem;
  font-weight: 500;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-dark);
    color: white;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-primary);
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté en tant qu'admin
    setIsAdmin(authService.isAuthenticated());
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const handleLogout = () => {
    authService.logout();
  };
  
  return (
    <Nav>
      <NavContainer>
        <Logo to="/">MonPortfolio</Logo>
        
        <MenuButton onClick={toggleMenu}>
          <FaBars />
        </MenuButton>
        
        <NavMenu isOpen={isMenuOpen}>
          <CloseButton onClick={closeMenu}>
            <FaTimes />
          </CloseButton>
          
          <NavItem>
            <NavLinkStyled to="/" onClick={closeMenu}>
              Accueil
            </NavLinkStyled>
          </NavItem>
          
          <NavItem>
            <NavLinkStyled to="/about" onClick={closeMenu}>
              À Propos
            </NavLinkStyled>
          </NavItem>
          
          <NavItem>
            <NavLinkStyled to="/projects" onClick={closeMenu}>
              Projets
            </NavLinkStyled>
          </NavItem>
          
          <NavItem>
            <NavLinkStyled to="/contact" onClick={closeMenu}>
              Contact
            </NavLinkStyled>
          </NavItem>
          
          {isAdmin ? (
            <>
              <NavItem>
                <AdminButton to="/admin">Dashboard</AdminButton>
              </NavItem>
              <NavItem>
                <AdminButton as="button" onClick={handleLogout}>
                  Déconnexion
                </AdminButton>
              </NavItem>
            </>
          ) : (
            <NavItem>
              <AdminButton to="/admin/login">Admin</AdminButton>
            </NavItem>
          )}
        </NavMenu>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
