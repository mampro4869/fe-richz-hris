import { NextRequest } from 'next/server';
import { authenticateUser } from '../../../../lib/auth';
import { successResponse, handleApiError } from '../../../../lib/response';
import { Employee } from '../../../../models';

export async function GET(request: NextRequest) {
  try {
    const { user } = await authenticateUser(request);

    // Get employee data if exists
    const employee = await Employee.findOne({
      where: { userId: user.id },
      include: [
        { association: 'department' },
        { association: 'position' },
        { association: 'manager' }
      ]
    });

    return successResponse({
      user: user.toJSON(),
      employee: employee?.toJSON() || null
    }, 'User profile retrieved successfully');

  } catch (error) {
    return handleApiError(error);
  }
}