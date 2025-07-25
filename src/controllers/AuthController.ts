import { Request, Response } from 'express';
import { AuthService } from '../service/authservice';
import { AuthValidation } from '../validations/authValidation';
import { IUserCreate, IUserLogin } from '../types';

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = await AuthValidation.registerSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      // Register user
      const result = await AuthService.register(validatedData as IUserCreate);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message || 'Registration failed'
        });
      }
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = await AuthValidation.loginSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      // Login user
      const result = await AuthService.login(validatedData as IUserLogin);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors
        });
      } else {
        res.status(401).json({
          success: false,
          message: error.message || 'Login failed'
        });
      }
    }
  }

  public static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await AuthService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get profile'
      });
    }
  }

  public static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      
      // Validate request body
      const validatedData = await AuthValidation.updateUserSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      // Update user
      const updatedUser = await AuthService.updateUser(userId, validatedData);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message || 'Profile update failed'
        });
      }
    }
  }

  // Admin-only endpoints
  public static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const result = await AuthService.getAllUsers(page, limit);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get users'
      });
    }
  }

  public static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      
      // Prevent admin from deleting themselves
      if (userId === req.user!.userId) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
        return;
      }

      const deleted = await AuthService.deleteUser(userId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete user'
      });
    }
  }

  public static async promoteToAdmin(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const updatedUser = await AuthService.promoteToAdmin(userId);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User promoted to admin successfully',
        data: { user: updatedUser }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to promote user'
      });
    }
  }

  public static async softDeleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      
      // Prevent admin from soft deleting themselves
      if (userId === req.user!.userId) {
        res.status(400).json({
          success: false,
          message: 'Cannot deactivate your own account'
        });
        return;
      }

      const user = await AuthService.softDeleteUser(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deactivated successfully',
        data: { user }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to deactivate user'
      });
    }
  }
}