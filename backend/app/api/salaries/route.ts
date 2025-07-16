import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { Salary, Employee, SalaryComponent, Department, Position } from '../../../models';
import { authenticateUser, requireRole } from '../../../lib/auth';
import { successResponse, errorResponse, handleApiError, paginatedResponse } from '../../../lib/response';

export async function GET(request: NextRequest) {
  try {
    const { payload } = await authenticateUser(request);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: any = { isActive: true };

    // Include employee search
    const includeClause: any = [
      {
        model: Employee,
        as: 'employee',
        include: [
          { model: Department, as: 'department' },
          { model: Position, as: 'position' }
        ]
      },
      { model: SalaryComponent, as: 'components' }
    ];

    if (search) {
      includeClause[0].where = {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { employeeId: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    if (department) {
      includeClause[0].include[0].where = { name: department };
    }

    const { count, rows } = await Salary.findAndCountAll({
      where: whereClause,
      include: includeClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return paginatedResponse(rows, { page, limit, total: count });

  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { payload } = await authenticateUser(request);
    requireRole(['admin', 'hr_staff'])(payload);

    const salaryData = await request.json();
    const { components, ...salaryInfo } = salaryData;
    
    salaryInfo.createdBy = payload.userId;

    // Create salary record
    const salary = await Salary.create(salaryInfo);

    // Create salary components if provided
    if (components && components.length > 0) {
      const componentsWithSalaryId = components.map((component: any) => ({
        ...component,
        salaryId: salary.id
      }));
      
      await SalaryComponent.bulkCreate(componentsWithSalaryId);
    }

    // Fetch the complete salary with components
    const createdSalary = await Salary.findByPk(salary.id, {
      include: [
        { model: Employee, as: 'employee' },
        { model: SalaryComponent, as: 'components' }
      ]
    });

    return successResponse(createdSalary, 'Salary created successfully', 201);

  } catch (error) {
    return handleApiError(error);
  }
}