const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  technologies: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('technologies');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('technologies', JSON.stringify(value));
    }
  },
  github_link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  live_link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  youtube_link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image_urls: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('image_urls');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('image_urls', JSON.stringify(value));
    }
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Project;
