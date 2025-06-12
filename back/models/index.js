const sequelize = require('../config/database');
const AdminUser = require('./admin.model');
const Project = require('./project.model');
const About = require('./about.model');
const Message = require('./message.model');
const Contact = require('./contact.model')(sequelize);
const Intro = require('./intro.model')(sequelize);

// Définir les relations entre les modèles si nécessaire
// (pas de relations complexes dans ce projet)

module.exports = {
  sequelize,
  AdminUser,
  Project,
  About,
  Message,
  Contact,
  Intro
};
