import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/database';

interface SalaryAttributes {
  id: number;
  employeeId: number;
  baseSalary: number;
  totalSalary: number;
  effectiveDate: Date;
  isActive: boolean;
  createdBy: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SalaryCreationAttributes extends Optional<SalaryAttributes, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Salary extends Model<SalaryAttributes, SalaryCreationAttributes> implements SalaryAttributes {
  public id!: number;
  public employeeId!: number;
  public baseSalary!: number;
  public totalSalary!: number;
  public effectiveDate!: Date;
  public isActive!: boolean;
  public createdBy!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Salary.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee'
    });
    
    Salary.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    
    Salary.hasMany(models.SalaryComponent, {
      foreignKey: 'salaryId',
      as: 'components'
    });
  }
}

Salary.init(
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
    baseSalary: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    totalSalary: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    effectiveDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Salary',
    tableName: 'salaries',
    timestamps: true,
  }
);

export default Salary;