import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { Contract, Employee, Department, Position } from '../../../models';
import { authenticateUser, requireRole } from '../../../lib/auth';
import { successResponse, errorResponse, handleApiError, paginatedResponse } from '../../../lib/response';

export async function GET(request: NextRequest) {
  try {
    const { payload } = await authenticateUser(request);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const contractType = searchParams.get('type') || '';
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (contractType) {
      whereClause.contractType = contractType;
    }

    // Include employee search
    const includeClause: any = [
      {
        model: Employee,
        as: 'employee',
        include: [
          { model: Department, as: 'department' },
          { model: Position, as: 'position' }
        ]
      }
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

    const { count, rows } = await Contract.findAndCountAll({
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

    const contractData = await request.json();
    contractData.createdBy = payload.userId;

    const contract = await Contract.create(contractData);

    const createdContract = await Contract.findByPk(contract.id, {
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [
            { model: Department, as: 'department' },
            { model: Position, as: 'position' }
          ]
        }
      ]
    });

    return successResponse(createdContract, 'Contract created successfully', 201);

  } catch (error) {
    return handleApiError(error);
  }
}