'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salaries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      baseSalary: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      totalSalary: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      effectiveDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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

    await queryInterface.addIndex('salaries', ['employeeId']);
    await queryInterface.addIndex('salaries', ['isActive']);
    await queryInterface.addIndex('salaries', ['effectiveDate']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('salaries');
  }
};