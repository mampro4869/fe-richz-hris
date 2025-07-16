'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@rocks.co.id',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'hr_staff',
        email: 'hr@rocks.co.id',
        password: hashedPassword,
        role: 'hr_staff',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'manager',
        email: 'manager@rocks.co.id',
        password: hashedPassword,
        role: 'manager',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};