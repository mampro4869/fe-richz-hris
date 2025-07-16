import { NextRequest } from 'next/server';
import { Department, Employee } from '../../../models';
import { authenticateUser, requireRole } from '../../../lib/auth';
import { successResponse, errorResponse, handleApiError } from '../../../lib/response';

export async function GET(request: NextRequest) {
  try {
    await authenticateUser(request);

    const departments = await Department.findAll({
      include: [
        { 
          model: Employee, 
          as: 'manager', 
          required: false,
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Employee,
          as: 'employees',
          attributes: ['id'],
          required: false
        }
      ],
      order: [['name', 'ASC']]
    });

    // Add employee count to each department
    const departmentsWithCount = departments.map(dept => ({
      ...dept.toJSON(),
      employeeCount: dept.employees?.length || 0
    }));

    return successResponse(departmentsWithCount, 'Departments retrieved successfully');

  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { payload } = await authenticateUser(request);
    requireRole(['admin', 'hr_staff'])(payload);

    const departmentData = await request.json();
    const department = await Department.create(departmentData);

    return successResponse(department, 'Department created successfully', 201);

  } catch (error) {
    return handleApiError(error);
  }
}