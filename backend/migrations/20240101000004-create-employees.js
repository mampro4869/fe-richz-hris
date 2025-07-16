'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employeeId: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      firstName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      gender: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      departmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'departments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      positionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'positions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      managerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'employees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      hireDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'terminated'),
        allowNull: false,
        defaultValue: 'active'
      },
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('employees', ['employeeId']);
    await queryInterface.addIndex('employees', ['email']);
    await queryInterface.addIndex('employees', ['departmentId']);
    await queryInterface.addIndex('employees', ['positionId']);
    await queryInterface.addIndex('employees', ['managerId']);
    await queryInterface.addIndex('employees', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('employees');
  }
};