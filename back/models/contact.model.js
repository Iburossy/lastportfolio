const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Contact = sequelize.define('Contact', {
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    github: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitter: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  return Contact;
};
