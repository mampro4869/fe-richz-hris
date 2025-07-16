import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/database';

interface EmployeeAttributes {
  id: number;
  employeeId: string;
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female';
  address?: string;
  departmentId: number;
  positionId: number;
  managerId?: number;
  hireDate: Date;
  status: 'active' | 'inactive' | 'terminated';
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EmployeeCreationAttributes extends Optional<EmployeeAttributes, 'id' | 'userId' | 'phone' | 'dateOfBirth' | 'gender' | 'address' | 'managerId' | 'avatar' | 'createdAt' | 'updatedAt'> {}

class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
  public id!: number;
  public employeeId!: string;
  public userId?: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone?: string;
  public dateOfBirth?: Date;
  public gender?: 'male' | 'female';
  public address?: string;
  public departmentId!: number;
  public positionId!: number;
  public managerId?: number;
  public hireDate!: Date;
  public status!: 'active' | 'inactive' | 'terminated';
  public avatar?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual field for full name
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public static associate(models: any) {
    Employee.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    Employee.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department'
    });
    
    Employee.belongsTo(models.Position, {
      foreignKey: 'positionId',
      as: 'position'
    });
    
    Employee.belongsTo(models.Employee, {
      foreignKey: 'managerId',
      as: 'manager'
    });
    
    Employee.hasMany(models.Employee, {
      foreignKey: 'managerId',
      as: 'subordinates'
    });
    
    Employee.hasMany(models.Contract, {
      foreignKey: 'employeeId',
      as: 'contracts'
    });
    
    Employee.hasMany(models.KPI, {
      foreignKey: 'employeeId',
      as: 'kpis'
    });
    
    Employee.hasOne(models.Salary, {
      foreignKey: 'employeeId',
      as: 'salary'
    });
  }
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [10, 20],
      },
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: true,
    },
    address: {
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
    positionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'positions',
        key: 'id',
      },
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'terminated'),
      allowNull: false,
      defaultValue: 'active',
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true,
    hooks: {
      beforeCreate: async (employee: Employee) => {
        if (!employee.employeeId) {
          // Generate employee ID: EMP + year + sequential number
          const year = new Date().getFullYear();
          const count = await Employee.count() + 1;
          employee.employeeId = `EMP${year}${count.toString().padStart(4, '0')}`;
        }
      },
    },
  }
);

export default Employee;