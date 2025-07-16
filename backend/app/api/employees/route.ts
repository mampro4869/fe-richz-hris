import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { Employee, Department, Position } from '../../../models';
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
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};
    
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { employeeId: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    // Department filter
    const includeClause: any = [
      { model: Department, as: 'department' },
      { model: Position, as: 'position' },
      { model: Employee, as: 'manager', required: false }
    ];

    if (department) {
      includeClause[0].where = { name: department };
    }

    const { count, rows } = await Employee.findAndCountAll({
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

    const employeeData = await request.json();

    const employee = await Employee.create(employeeData);

    const createdEmployee = await Employee.findByPk(employee.id, {
      include: [
        { model: Department, as: 'department' },
        { model: Position, as: 'position' },
        { model: Employee, as: 'manager', required: false }
      ]
    });

    return successResponse(createdEmployee, 'Employee created successfully', 201);

  } catch (error) {
    return handleApiError(error);
  }
}