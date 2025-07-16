import sequelize from '../lib/database';
import User from './User';
import Employee from './Employee';
import Department from './Department';
import Position from './Position';
import Contract from './Contract';
import KPI from './KPI';
import KPIMetric from './KPIMetric';
import Salary from './Salary';
import SalaryComponent from './SalaryComponent';

// Initialize all models
const models = {
  User,
  Employee,
  Department,
  Position,
  Contract,
  KPI,
  KPIMetric,
  Salary,
  SalaryComponent
};

// Define associations
Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export {
  sequelize,
  User,
  Employee,
  Department,
  Position,
  Contract,
  KPI,
  KPIMetric,
  Salary,
  SalaryComponent
};

export default models;