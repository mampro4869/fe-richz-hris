'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kpi_metrics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kpiId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'kpis',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      weight: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      target: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false
      },
      achievement: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false
      },
      score: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false
      },
      maxScore: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 5.0
      },
      status: {
        type: Sequelize.ENUM('excellent', 'good', 'fair', 'poor'),
        allowNull: false
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

    await queryInterface.addIndex('kpi_metrics', ['kpiId']);
    await queryInterface.addIndex('kpi_metrics', ['category']);
    await queryInterface.addIndex('kpi_metrics', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('kpi_metrics');
  }
};