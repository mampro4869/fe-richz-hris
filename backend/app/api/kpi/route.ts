import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { KPI, Employee, KPIMetric } from '../../../models';
import { authenticateUser, requireRole } from '../../../lib/auth';
import { successResponse, errorResponse, handleApiError, paginatedResponse } from '../../../lib/response';

export async function GET(request: NextRequest) {
  try {
    const { payload } = await authenticateUser(request);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const employeeId = searchParams.get('employeeId');
    const quarter = searchParams.get('quarter');
    const year = searchParams.get('year');
    const status = searchParams.get('status');

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};
    
    if (employeeId) {
      whereClause.employeeId = employeeId;
    }
    
    if (quarter) {
      whereClause.quarter = quarter;
    }
    
    if (year) {
      whereClause.year = year;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await KPI.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: Employee, 
          as: 'employee',
          attributes: ['id', 'firstName', 'lastName', 'email', 'employeeId'],
          include: [
            { association: 'department' },
            { association: 'position' }
          ]
        },
        { 
          model: Employee, 
          as: 'evaluator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        { model: KPIMetric, as: 'metrics' }
      ],
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
    requireRole(['admin', 'manager', 'hr_staff'])(payload);

    const kpiData = await request.json();
    const { metrics, ...kpiInfo } = kpiData;

    // Create KPI record
    const kpi = await KPI.create(kpiInfo);

    // Create KPI metrics if provided
    if (metrics && metrics.length > 0) {
      const metricsWithKpiId = metrics.map((metric: any) => ({
        ...metric,
        kpiId: kpi.id
      }));
      
      await KPIMetric.bulkCreate(metricsWithKpiId);
    }

    // Fetch the complete KPI with metrics
    const createdKPI = await KPI.findByPk(kpi.id, {
      include: [
        { model: Employee, as: 'employee' },
        { model: Employee, as: 'evaluator' },
        { model: KPIMetric, as: 'metrics' }
      ]
    });

    return successResponse(createdKPI, 'KPI created successfully', 201);

  } catch (error) {
    return handleApiError(error);
  }
}