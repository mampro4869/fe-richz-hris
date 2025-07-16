import { NextRequest } from 'next/server';
import { Employee, Department, Position, Contract, KPI, Salary } from '../../../../models';
import { authenticateUser, requireRole } from '../../../../lib/auth';
import { successResponse, errorResponse, handleApiError } from '../../../../lib/response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { payload } = await authenticateUser(request);
    
    const employee = await Employee.findByPk(params.id, {
      include: [
        { model: Department, as: 'department' },
        { model: Position, as: 'position' },
        { model: Employee, as: 'manager', required: false },
        { model: Contract, as: 'contracts' },
        { model: KPI, as: 'kpis', limit: 5, order: [['createdAt', 'DESC']] },
        { model: Salary, as: 'salary', include: ['components'] }
      ]
    });

    if (!employee) {
      return errorResponse('Employee not found', 404);
    }

    return successResponse(employee, 'Employee retrieved successfully');

  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { payload } = await authenticateUser(request);
    requireRole(['admin', 'hr_staff'])(payload);

    const employee = await Employee.findByPk(params.id);
    if (!employee) {
      return errorResponse('Employee not found', 404);
    }

    const updateData = await request.json();
    await employee.update(updateData);

    const updatedEmployee = await Employee.findByPk(params.id, {
      include: [
        { model: Department, as: 'department' },
        { model: Position, as: 'position' },
        { model: Employee, as: 'manager', required: false }
      ]
    });

    return successResponse(updatedEmployee, 'Employee updated successfully');

  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { payload } = await authenticateUser(request);
    requireRole(['admin'])(payload);

    const employee = await Employee.findByPk(params.id);
    if (!employee) {
      return errorResponse('Employee not found', 404);
    }

    await employee.destroy();

    return successResponse(null, 'Employee deleted successfully');

  } catch (error) {
    return handleApiError(error);
  }
}