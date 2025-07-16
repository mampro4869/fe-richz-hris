import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { User } from '../models';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

export const getTokenFromRequest = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

export const authenticateUser = async (request: NextRequest) => {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      throw new Error('No token provided');
    }

    const payload = verifyToken(token);
    const user = await User.findByPk(payload.userId);
    
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    return { user, payload };
  } catch (error) {
    throw new Error('Authentication failed');
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (payload: JWTPayload) => {
    if (!allowedRoles.includes(payload.role)) {
      throw new Error('Insufficient permissions');
    }
  };
};