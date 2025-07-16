import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/database';

interface ContractAttributes {
  id: number;
  employeeId: number;
  contractType: 'PKWT' | 'PKWTT';
  startDate: Date;
  endDate?: Date;
  duration?: number; // in months
  baseSalary: number;
  status: 'active' | 'expired' | 'terminated' | 'renewed';
  documentPath?: string;
  notes?: string;
  createdBy: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContractCreationAttributes extends Optional<ContractAttributes, 'id' | 'endDate' | 'duration' | 'documentPath' | 'notes' | 'createdAt' | 'updatedAt'> {}

class Contract extends Model<ContractAttributes, ContractCreationAttributes> implements ContractAttributes {
  public id!: number;
  public employeeId!: number;
  public contractType!: 'PKWT' | 'PKWTT';
  public startDate!: Date;
  public endDate?: Date;
  public duration?: number;
  public baseSalary!: number;
  public status!: 'active' | 'expired' | 'terminated' | 'renewed';
  public documentPath?: string;
  public notes?: string;
  public createdBy!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Contract.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee'
    });
    
    Contract.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
  }
}

Contract.init(
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
    contractType: {
      type: DataTypes.ENUM('PKWT', 'PKWTT'),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Duration in months',
    },
    baseSalary: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'terminated', 'renewed'),
      allowNull: false,
      defaultValue: 'active',
    },
    documentPath: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: 'Contract',
    tableName: 'contracts',
    timestamps: true,
  }
);

export default Contract;