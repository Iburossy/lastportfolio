const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Modèle pour les compétences
 */
const Skill = sequelize.define('Skill', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 80,
    validate: {
      min: 0,
      max: 100
    }
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  }
}, {
  tableName: 'skills',
  timestamps: true
});

module.exports = Skill;
