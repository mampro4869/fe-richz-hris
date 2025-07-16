import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/database';

interface SalaryComponentAttributes {
  id: number;
  salaryId: number;
  name: string;
  type: 'fixed' | 'percentage';
  amount: number;
  percentage?: number;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SalaryComponentCreationAttributes extends Optional<SalaryComponentAttributes, 'id' | 'percentage' | 'description' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class SalaryComponent extends Model<SalaryComponentAttributes, SalaryComponentCreationAttributes> implements SalaryComponentAttributes {
  public id!: number;
  public salaryId!: number;
  public name!: string;
  public type!: 'fixed' | 'percentage';
  public amount!: number;
  public percentage?: number;
  public description?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    SalaryComponent.belongsTo(models.Salary, {
      foreignKey: 'salaryId',
      as: 'salary'
    });
  }
}

SalaryComponent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    salaryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'salaries',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('fixed', 'percentage'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'SalaryComponent',
    tableName: 'salary_components',
    timestamps: true,
  }
);

export default SalaryComponent;