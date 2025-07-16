'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('positions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
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
        onDelete: 'CASCADE'
      },
      level: {
        type: Sequelize.ENUM('junior', 'mid', 'senior', 'lead', 'manager', 'director'),
        allowNull: false,
        defaultValue: 'junior'
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

    await queryInterface.addIndex('positions', ['departmentId']);
    await queryInterface.addIndex('positions', ['level']);
    await queryInterface.addIndex('positions', ['isActive']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('positions');
  }
};