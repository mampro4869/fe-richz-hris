'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salary_components', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      salaryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'salaries',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('fixed', 'percentage'),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

    await queryInterface.addIndex('salary_components', ['salaryId']);
    await queryInterface.addIndex('salary_components', ['type']);
    await queryInterface.addIndex('salary_components', ['isActive']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('salary_components');
  }
};