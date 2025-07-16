import { NextRequest } from 'next/server';
import { User } from '../../../../models';
import { generateToken } from '../../../../lib/auth';
import { successResponse, errorResponse, handleApiError } from '../../../../lib/response';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, role = 'employee' } = await request.json();

    if (!username || !email || !password) {
      return errorResponse('Username, email, and password are required', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        $or: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return errorResponse('User already exists', 409);
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    return successResponse({
      token,
      user: user.toJSON()
    }, 'User registered successfully', 201);

  } catch (error) {
    return handleApiError(error);
  }
}