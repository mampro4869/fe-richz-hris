'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('employees', [
      {
        employeeId: 'EMP20240001',
        userId: 2, // hr_staff user
        firstName: 'Ahmad',
        lastName: 'Fauzi',
        email: 'ahmad.fauzi@rocks.co.id',
        phone: '+62812345678',
        dateOfBirth: '1992-03-15',
        gender: 'male',
        address: 'Jakarta, Indonesia',
        departmentId: 1, // Design
        positionId: 1, // UI/UX Designer
        hireDate: '2022-01-15',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        employeeId: 'EMP20240002',
        firstName: 'Siti',
        lastName: 'Nurhaliza',
        email: 'siti.nurhaliza@rocks.co.id',
        phone: '+62812345679',
        dateOfBirth: '1990-07-22',
        gender: 'female',
        address: 'Bandung, Indonesia',
        departmentId: 2, // Development
        positionId: 3, // Front-End Developer
        hireDate: '2021-06-01',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        employeeId: 'EMP20240003',
        firstName: 'Budi',
        lastName: 'Santoso',
        email: 'budi.santoso@rocks.co.id',
        phone: '+62812345680',
        dateOfBirth: '1988-11-10',
        gender: 'male',
        address: 'Surabaya, Indonesia',
        departmentId: 2, // Development
        positionId: 4, // Back-End Developer
        managerId: null,
        hireDate: '2020-03-01',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        employeeId: 'EMP20240004',
        firstName: 'Dewi',
        lastName: 'Lestari',
        email: 'dewi.lestari@rocks.co.id',
        phone: '+62812345681',
        dateOfBirth: '1993-05-18',
        gender: 'female',
        address: 'Yogyakarta, Indonesia',
        departmentId: 3, // HR
        positionId: 6, // HR Manager
        hireDate: '2021-09-15',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        employeeId: 'EMP20240005',
        firstName: 'Rudi',
        lastName: 'Hermawan',
        email: 'rudi.hermawan@rocks.co.id',
        phone: '+62812345682',
        dateOfBirth: '1991-12-03',
        gender: 'male',
        address: 'Medan, Indonesia',
        departmentId: 4, // Marketing
        positionId: 8, // Marketing Manager
        hireDate: '2022-04-01',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employees', null, {});
  }
};