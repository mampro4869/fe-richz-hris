'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contracts', {
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
      contractType: {
        type: Sequelize.ENUM('PKWT', 'PKWTT'),
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Duration in months'
      },
      baseSalary: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'expired', 'terminated', 'renewed'),
        allowNull: false,
        defaultValue: 'active'
      },
      documentPath: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
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

    await queryInterface.addIndex('contracts', ['employeeId']);
    await queryInterface.addIndex('contracts', ['contractType']);
    await queryInterface.addIndex('contracts', ['status']);
    await queryInterface.addIndex('contracts', ['startDate']);
    await queryInterface.addIndex('contracts', ['endDate']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contracts');
  }
};