import { NextRequest } from 'next/server';
import { KPI, Employee, KPIMetric } from '../../../../models';
import { authenticateUser, requireRole } from '../../../../lib/auth';
import { successResponse, errorResponse, handleApiError } from '../../../../lib/response';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { payload } = await authenticateUser(request);
    
    const kpi = await KPI.findByPk(params.id, {
      include: [
        { 
          model: Employee, 
          as: 'employee',
          include: [
            { association: 'department' },
            { association: 'position' }
          ]
        },
        { model: Employee, as: 'evaluator' },
        { model: KPIMetric, as: 'metrics' }
      ]
    });

    if (!kpi) {
      return errorResponse('KPI not found', 404);
    }

    return successResponse(kpi, 'KPI retrieved successfully');

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
    requireRole(['admin', 'manager', 'hr_staff'])(payload);

    const kpi = await KPI.findByPk(params.id);
    if (!kpi) {
      return errorResponse('KPI not found', 404);
    }

    const updateData = await request.json();
    const { metrics, ...kpiInfo } = updateData;

    // Update KPI
    await kpi.update(kpiInfo);

    // Update metrics if provided
    if (metrics) {
      // Delete existing metrics
      await KPIMetric.destroy({ where: { kpiId: kpi.id } });
      
      // Create new metrics
      const metricsWithKpiId = metrics.map((metric: any) => ({
        ...metric,
        kpiId: kpi.id
      }));
      
      await KPIMetric.bulkCreate(metricsWithKpiId);
    }

    // Fetch updated KPI
    const updatedKPI = await KPI.findByPk(params.id, {
      include: [
        { model: Employee, as: 'employee' },
        { model: Employee, as: 'evaluator' },
        { model: KPIMetric, as: 'metrics' }
      ]
    });

    return successResponse(updatedKPI, 'KPI updated successfully');

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

    const kpi = await KPI.findByPk(params.id);
    if (!kpi) {
      return errorResponse('KPI not found', 404);
    }

    await kpi.destroy();

    return successResponse(null, 'KPI deleted successfully');

  } catch (error) {
    return handleApiError(error);
  }
}