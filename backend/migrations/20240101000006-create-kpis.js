'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kpis', {
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
      evaluatorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      period: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      quarter: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      overallScore: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false
      },
      maxScore: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 5.0
      },
      percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      grade: {
        type: Sequelize.STRING(5),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('draft', 'pending_approval', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'draft'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      recommendations: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      actionPlan: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      nextReviewDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      evaluationDate: {
        type: Sequelize.DATEONLY,
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

    await queryInterface.addIndex('kpis', ['employeeId']);
    await queryInterface.addIndex('kpis', ['evaluatorId']);
    await queryInterface.addIndex('kpis', ['period']);
    await queryInterface.addIndex('kpis', ['quarter', 'year']);
    await queryInterface.addIndex('kpis', ['status']);
    await queryInterface.addConstraint('kpis', {
      fields: ['employeeId', 'period'],
      type: 'unique',
      name: 'unique_employee_period'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('kpis');
  }
};