import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const successResponse = <T>(
  data: T,
  message: string = 'Success',
  status: number = 200
): NextResponse<ApiResponse<T>> => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
};

export const errorResponse = (
  message: string,
  status: number = 400,
  error?: string
): NextResponse<ApiResponse> => {
  return NextResponse.json(
    {
      success: false,
      message,
      error,
    },
    { status }
  );
};

export const paginatedResponse = <T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message: string = 'Success'
): NextResponse<ApiResponse<T[]>> => {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  
  return NextResponse.json({
    success: true,
    message,
    data,
    pagination: {
      ...pagination,
      totalPages,
    },
  });
};

export const handleApiError = (error: any): NextResponse<ApiResponse> => {
  console.error('API Error:', error);
  
  if (error.name === 'SequelizeValidationError') {
    return errorResponse(
      'Validation error',
      400,
      error.errors.map((e: any) => e.message).join(', ')
    );
  }
  
  if (error.name === 'SequelizeUniqueConstraintError') {
    return errorResponse(
      'Duplicate entry',
      409,
      'Resource already exists'
    );
  }
  
  if (error.message === 'Authentication failed') {
    return errorResponse('Authentication failed', 401);
  }
  
  if (error.message === 'Insufficient permissions') {
    return errorResponse('Insufficient permissions', 403);
  }
  
  return errorResponse(
    'Internal server error',
    500,
    process.env.NODE_ENV === 'development' ? error.message : undefined
  );
};