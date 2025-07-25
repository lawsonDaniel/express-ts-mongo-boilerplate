import jwt from 'jsonwebtoken';
import { UserRepository, IUserDocument} from "../model/user.model"
import { IUserCreate, IUserLogin, IAuthResponse, IJwtPayload, UserRole } from '../types';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  public static async register(userData: IUserCreate): Promise<IAuthResponse> {
    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user (password will be hashed by pre-save middleware)
    const user:any = await UserRepository.create(userData);
    
    // Generate JWT token
    const token = this.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return {
      user: user.toJSON(),
      token
    };
  }

  public static async login(loginData: IUserLogin): Promise<IAuthResponse> {
    // Find user by email (with password field)
    const user:any = await UserRepository.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password using instance method
    const isPasswordValid = await user.comparePassword(loginData.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return {
      user: user.toJSON(),
      token
    };
  }

  public static async getUserById(userId: string): Promise<Omit<IUserDocument, 'password'> | null> {
    const user:any = await UserRepository.findById(userId);
    return user ? user.toJSON() : null;
  }

  public static async getAllUsers(page?: number, limit?: number): Promise<{
    users: any;
    pagination?: {
      total: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    if (page && limit) {
      const result = await UserRepository.findWithPagination(page, limit);
      return {
        users: (result.users as IUserDocument[]).map(user => user.toJSON()),
        pagination: {
          total: result.total,
          totalPages: result.totalPages,
          currentPage: result.currentPage
        }
      };
    } else {
      const users:any = await UserRepository.findAll();
      return {
        users: users.map((user:any) => user.toJSON())
      };
    }
  }

  public static async updateUser(userId: string, updateData: Partial<IUserCreate>): Promise<Omit<IUserDocument, 'password'> | null> {
    const updatedUser:any = await UserRepository.update(userId, updateData);
    return updatedUser ? updatedUser.toJSON() : null;
  }

  public static async deleteUser(userId: string): Promise<boolean> {
    return UserRepository.delete(userId);
  }

  public static async softDeleteUser(userId: string): Promise<Omit<IUserDocument, 'password'> | null> {
    const user:any = await UserRepository.softDelete(userId);
    return user ? user.toJSON() : null;
  }

  public static verifyToken(token: string): IJwtPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as IJwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  private static generateToken(payload: IJwtPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    });
  }

  // Admin-specific methods
  public static async createAdminUser(userData: IUserCreate): Promise<IAuthResponse> {
    const adminData = { ...userData, role: UserRole.ADMIN };
    return this.register(adminData);
  }

  public static async promoteToAdmin(userId: string){
    return this.updateUser(userId, { role: UserRole.ADMIN });
  }
}