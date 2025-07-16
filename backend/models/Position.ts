import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/database';

interface PositionAttributes {
  id: number;
  title: string;
  description?: string;
  departmentId: number;
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PositionCreationAttributes extends Optional<PositionAttributes, 'id' | 'description' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Position extends Model<PositionAttributes, PositionCreationAttributes> implements PositionAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public departmentId!: number;
  public level!: 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director';
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Position.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department'
    });
    
    Position.hasMany(models.Employee, {
      foreignKey: 'positionId',
      as: 'employees'
    });
  }
}

Position.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'departments',
        key: 'id',
      },
    },
    level: {
      type: DataTypes.ENUM('junior', 'mid', 'senior', 'lead', 'manager', 'director'),
      allowNull: false,
      defaultValue: 'junior',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Position',
    tableName: 'positions',
    timestamps: true,
  }
);

export default Position;