-- Création de la base de données
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Table des utilisateurs administrateurs
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des projets
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT NOT NULL,
  github_link VARCHAR(255),
  youtube_link VARCHAR(255),
  image_urls TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des informations "About"
CREATE TABLE IF NOT EXISTS abouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  skills TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insertion d'un utilisateur administrateur par défaut (mot de passe: admin123)
-- Note: Le mot de passe sera hashé par l'application, cette valeur est juste pour l'initialisation
INSERT INTO admin_users (username, password) 
VALUES ('admin', '$2a$10$XlAG6AxA6b5WLSwRpAp3iOVbVvzWNj.Rd4Uas3sPVWGsYnZvDJNuO')
ON DUPLICATE KEY UPDATE username = username;

-- Insertion d'un contenu par défaut pour la section "About"
INSERT INTO abouts (content, skills)
VALUES (
  'Bienvenue sur mon portfolio. Modifiez cette section pour vous présenter.',
  '[{"name":"HTML/CSS","level":90},{"name":"JavaScript","level":85},{"name":"React","level":80},{"name":"Node.js","level":75}]'
)
ON DUPLICATE KEY UPDATE id = id;
