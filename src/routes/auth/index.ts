import { Router } from 'express';
import { AuthController } from '../../controllers/AuthController';
import { AuthMiddleware } from '../../middleware/authorization';
import { UserRole } from '../../types';

export class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public routes
    this.router.post('/register', AuthController.register);
    this.router.post('/login', AuthController.login);

    // Protected routes (requires authentication)
    this.router.get('/profile', 
      AuthMiddleware.authenticate, 
      AuthController.getProfile
    );
    
    this.router.put('/profile', 
      AuthMiddleware.authenticate, 
      AuthController.updateProfile
    );

    // Admin-only routes
    this.router.get('/users', 
      AuthMiddleware.authenticate,
      AuthMiddleware.requireAdmin,
      AuthController.getAllUsers
    );

    this.router.delete('/users/:id', 
      AuthMiddleware.authenticate,
      AuthMiddleware.requireAdmin,
      AuthController.deleteUser
    );

    this.router.put('/users/:id/promote', 
      AuthMiddleware.authenticate,
      AuthMiddleware.requireAdmin,
      AuthController.promoteToAdmin
    );

    this.router.put('/users/:id/soft-delete', 
      AuthMiddleware.authenticate,
      AuthMiddleware.requireAdmin,
      AuthController.softDeleteUser
    );

    // Alternative: Using role-based middleware
    this.router.get('/admin-only', 
      AuthMiddleware.authenticate,
      AuthMiddleware.requireRole([UserRole.ADMIN]),
      (req, res) => {
        res.json({ 
          success: true, 
          message: 'Admin access granted',
          user: req.user
        });
      }
    );
  }
}