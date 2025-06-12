const bcrypt = require('bcryptjs');
const { AdminUser } = require('../models');
require('dotenv').config();

async function createAdminUser() {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await AdminUser.findOne({ where: { username: 'admins' } });
    
    if (existingUser) {
      console.log('Un utilisateur avec ce nom existe déjà. Mise à jour du mot de passe...');
      
      // Mettre à jour l'utilisateur existant (le hook beforeUpdate se chargera du hachage)
      await existingUser.update(
        { password: 'lemakois12@' },
        { individualHooks: true }
      );
      
      console.log('Mot de passe mis à jour avec succès!');
      return;
    }
    
    // Créer le nouvel utilisateur admin (le hook beforeCreate se chargera du hachage)
    const newUser = await AdminUser.create(
      {
        username: 'admins',
        password: 'lemakois12@',
        role: 'admin'
      },
      { individualHooks: true }
    );
    
    console.log('Utilisateur administrateur créé avec succès:');
    console.log(`- Nom d'utilisateur: ${newUser.username}`);
    console.log('- Rôle: admin');
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur admin:', error);
  } finally {
    process.exit();
  }
}

// Exécuter la fonction
createAdminUser();
