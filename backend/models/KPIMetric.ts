import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/database';

interface KPIMetricAttributes {
  id: number;
  kpiId: number;
  category: string;
  title: string;
  description: string;
  weight: number; // percentage
  target: number;
  achievement: number;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  createdAt?: Date;
  updatedAt?: Date;
}

interface KPIMetricCreationAttributes extends Optional<KPIMetricAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class KPIMetric extends Model<KPIMetricAttributes, KPIMetricCreationAttributes> implements KPIMetricAttributes {
  public id!: number;
  public kpiId!: number;
  public category!: string;
  public title!: string;
  public description!: string;
  public weight!: number;
  public target!: number;
  public achievement!: number;
  public score!: number;
  public maxScore!: number;
  public status!: 'excellent' | 'good' | 'fair' | 'poor';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    KPIMetric.belongsTo(models.KPI, {
      foreignKey: 'kpiId',
      as: 'kpi'
    });
  }
}

KPIMetric.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kpiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'kpis',
        key: 'id',
      },
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    target: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    achievement: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    score: {
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
    status: {
      type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'KPIMetric',
    tableName: 'kpi_metrics',
    timestamps: true,
  }
);

export default KPIMetric;