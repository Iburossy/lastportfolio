const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Intro = sequelize.define("Intro", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Bienvenue sur mon Portfolio"
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Développeur Fullstack passionné par la création d'applications web modernes et performantes."
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    button_text: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "En savoir plus"
    },
    button_link: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "/about"
    }
  });

  return Intro;
};
