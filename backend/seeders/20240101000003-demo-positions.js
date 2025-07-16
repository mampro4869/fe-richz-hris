'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('positions', [
      // Design Department (ID: 1)
      {
        title: 'UI/UX Designer',
        description: 'User Interface and User Experience Designer',
        departmentId: 1,
        level: 'mid',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Graphic Designer',
        description: 'Visual and Graphic Designer',
        departmentId: 1,
        level: 'junior',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Development Department (ID: 2)
      {
        title: 'Front-End Developer',
        description: 'Frontend Web Developer',
        departmentId: 2,
        level: 'mid',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Back-End Developer',
        description: 'Backend API Developer',
        departmentId: 2,
        level: 'senior',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Full-Stack Developer',
        description: 'Full Stack Web Developer',
        departmentId: 2,
        level: 'senior',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // HR Department (ID: 3)
      {
        title: 'HR Manager',
        description: 'Human Resource Manager',
        departmentId: 3,
        level: 'manager',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'HR Specialist',
        description: 'Human Resource Specialist',
        departmentId: 3,
        level: 'mid',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Marketing Department (ID: 4)
      {
        title: 'Marketing Manager',
        description: 'Marketing and Sales Manager',
        departmentId: 4,
        level: 'manager',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Content Writer',
        description: 'Content Creator and Writer',
        departmentId: 4,
        level: 'junior',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('positions', null, {});
  }
};