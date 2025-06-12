const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const About = sequelize.define('about', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  specialties: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('specialties');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('specialties', JSON.stringify(value));
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  photo_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('skills');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('skills', JSON.stringify(value));
    }
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: false
});

module.exports = About;
