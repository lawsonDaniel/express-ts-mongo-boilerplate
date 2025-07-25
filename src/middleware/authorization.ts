import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../service/authservice';
import { IJwtPayload, UserRole } from '../types';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

export class AuthMiddleware {
  public static authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ 
          success: false, 
          message: 'Access token is required' 
        });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const decoded = AuthService.verifyToken(token);
      
      // Add user info to request object
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
  };

  public static requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }

    if (req.user.role !== UserRole.ADMIN) {
      res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
      return;
    }

    next();
  };

  public static requireRole = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({ 
          success: false, 
          message: 'Insufficient permissions' 
        });
        return;
      }

      next();
    };
  };
}