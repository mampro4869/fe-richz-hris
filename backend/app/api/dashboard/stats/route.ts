import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { Employee, Contract, KPI, Salary, Department } from '../../../../models';
import { authenticateUser } from '../../../../lib/auth';
import { successResponse, handleApiError } from '../../../../lib/response';

export async function GET(request: NextRequest) {
  try {
    await authenticateUser(request);

    // Get current date for calculations
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Total employees
    const totalEmployees = await Employee.count({
      where: { status: 'active' }
    });

    // Active employees
    const activeEmployees = await Employee.count({
      where: { status: 'active' }
    });

    // Inactive employees
    const inactiveEmployees = await Employee.count({
      where: { status: { [Op.in]: ['inactive', 'terminated'] } }
    });

    // Contracts expiring soon (next 30 days)
    const expiringContracts = await Contract.count({
      where: {
        status: 'active',
        endDate: {
          [Op.between]: [currentDate, new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000)]
        }
      }
    });

    // Average KPI score for current quarter
    const currentQuarter = Math.ceil(currentMonth / 3);
    const avgKPI = await KPI.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('overallScore')), 'avgScore']
      ],
      where: {
        quarter: currentQuarter,
        year: currentYear,
        status: 'approved'
      }
    });

    // Total payroll
    const totalPayroll = await Salary.sum('totalSalary', {
      where: { isActive: true }
    });

    // Department distribution
    const departmentStats = await Department.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('employees.id')), 'employeeCount']
      ],
      include: [
        {
          model: Employee,
          as: 'employees',
          attributes: [],
          where: { status: 'active' },
          required: false
        }
      ],
      group: ['Department.id', 'Department.name'],
      order: [[sequelize.literal('employeeCount'), 'DESC']]
    });

    // Recent activities (last 30 days)
    const recentActivities = await Employee.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const stats = {
      employees: {
        total: totalEmployees,
        active: activeEmployees,
        inactive: inactiveEmployees
      },
      contracts: {
        expiringSoon: expiringContracts
      },
      kpi: {
        averageScore: avgKPI?.get('avgScore') || 0
      },
      payroll: {
        total: totalPayroll || 0
      },
      departments: departmentStats,
      activities: {
        recent: recentActivities
      }
    };

    return successResponse(stats, 'Dashboard statistics retrieved successfully');

  } catch (error) {
    return handleApiError(error);
  }
}