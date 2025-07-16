import { NextRequest } from 'next/server';
import { User } from '../../../../models';
import { generateToken } from '../../../../lib/auth';
import { successResponse, errorResponse, handleApiError } from '../../../../lib/response';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return errorResponse('Username and password are required', 400);
    }

    // Find user by username or email
    const user = await User.findOne({
      where: {
        $or: [
          { username },
          { email: username }
        ]
      }
    });

    if (!user) {
      return errorResponse('Invalid credentials', 401);
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return errorResponse('Invalid credentials', 401);
    }

    if (!user.isActive) {
      return errorResponse('Account is deactivated', 401);
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

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
    }, 'Login successful');

  } catch (error) {
    return handleApiError(error);
  }
}