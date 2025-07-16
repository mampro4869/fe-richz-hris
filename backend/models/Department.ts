import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/database';

interface DepartmentAttributes {
  id: number;
  name: string;
  description?: string;
  managerId?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DepartmentCreationAttributes extends Optional<DepartmentAttributes, 'id' | 'description' | 'managerId' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Department extends Model<DepartmentAttributes, DepartmentCreationAttributes> implements DepartmentAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public managerId?: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Department.hasMany(models.Employee, {
      foreignKey: 'departmentId',
      as: 'employees'
    });
    
    Department.belongsTo(models.Employee, {
      foreignKey: 'managerId',
      as: 'manager'
    });
  }
}

Department.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Department',
    tableName: 'departments',
    timestamps: true,
  }
);

export default Department;