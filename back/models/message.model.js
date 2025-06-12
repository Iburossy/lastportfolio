const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sent_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

module.exports = Message;
