import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';

// Lazy loading des pages pour optimiser le chargement
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Pages Admin (protégées)
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const ProjectsList = lazy(() => import('./admin/ProjectsList'));
const ProjectForm = lazy(() => import('./admin/ProjectForm'));
const AboutForm = lazy(() => import('./admin/AboutForm'));
const MessagesPage = lazy(() => import('./admin/MessagesPage'));
const ContactInfoPage = lazy(() => import('./pages/admin/ContactInfoPage'));
const IntroPage = lazy(() => import('./pages/admin/IntroPage'));
const ExperienceManager = lazy(() => import('./admin/ExperienceManager'));
const ExperienceForm = lazy(() => import('./admin/ExperienceForm'));
const ExperiencesList = lazy(() => import('./admin/ExperiencesList'));
const SkillsManager = lazy(() => import('./admin/SkillsManager'));

// Route Guard pour les pages protégées
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// Page 404
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<Loader fullScreen text="Chargement de la page..." />}>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Routes admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects" element={
              <ProtectedRoute>
                <ProjectsList />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects/new" element={
              <ProtectedRoute>
                <ProjectForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects/:id/edit" element={
              <ProtectedRoute>
                <ProjectForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/about" element={
              <ProtectedRoute>
                <AboutForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/messages" element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/contact-info" element={
              <ProtectedRoute>
                <ContactInfoPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/intro" element={
              <ProtectedRoute>
                <IntroPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/experiences" element={
              <ProtectedRoute>
                <ExperiencesList />
              </ProtectedRoute>
            } />
            <Route path="/admin/experiences/new" element={
              <ProtectedRoute>
                <ExperienceForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/experiences/edit/:id" element={
              <ProtectedRoute>
                <ExperienceForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/skills" element={
              <ProtectedRoute>
                <SkillsManager />
              </ProtectedRoute>
            } />
            
            {/* Route 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;
