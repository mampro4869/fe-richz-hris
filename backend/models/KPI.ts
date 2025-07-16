import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/database';

interface KPIAttributes {
  id: number;
  employeeId: number;
  evaluatorId: number;
  period: string; // e.g., "Q1-2024"
  quarter: number;
  year: number;
  overallScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  notes?: string;
  recommendations?: string;
  actionPlan?: string;
  nextReviewDate?: Date;
  evaluationDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface KPICreationAttributes extends Optional<KPIAttributes, 'id' | 'notes' | 'recommendations' | 'actionPlan' | 'nextReviewDate' | 'createdAt' | 'updatedAt'> {}

class KPI extends Model<KPIAttributes, KPICreationAttributes> implements KPIAttributes {
  public id!: number;
  public employeeId!: number;
  public evaluatorId!: number;
  public period!: string;
  public quarter!: number;
  public year!: number;
  public overallScore!: number;
  public maxScore!: number;
  public percentage!: number;
  public grade!: string;
  public status!: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  public notes?: string;
  public recommendations?: string;
  public actionPlan?: string;
  public nextReviewDate?: Date;
  public evaluationDate!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    KPI.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee'
    });
    
    KPI.belongsTo(models.Employee, {
      foreignKey: 'evaluatorId',
      as: 'evaluator'
    });
    
    KPI.hasMany(models.KPIMetric, {
      foreignKey: 'kpiId',
      as: 'metrics'
    });
  }
}

KPI.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    evaluatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    period: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    quarter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 4,
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    overallScore: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      },
    },
    maxScore: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      defaultValue: 5.0,
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    grade: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending_approval', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'draft',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recommendations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    actionPlan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nextReviewDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    evaluationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'KPI',
    tableName: 'kpis',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['employeeId', 'period']
      }
    ]
  }
);

export default KPI;