import { userRepository } from '../repositories/user.repo';
import { verifyPassword } from '@/lib/auth/hash';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/tokens';

export class AuthService {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);

    if (!user || user.deletedAt) {
      throw new Error('Invalid credentials');
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        departmentId: user.departmentId,
        department: user.department,
      },
      accessToken,
      refreshToken,
    };
  }
}

export const authService = new AuthService();
