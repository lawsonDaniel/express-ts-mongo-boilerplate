// src/validation/AuthValidation.ts
import * as yup from 'yup';
import { UserRole } from '../types';

export class AuthValidation {
  public static readonly registerSchema = yup.object({
    email: yup
      .string()
      .email('Please provide a valid email')
      .required('Email is required')
      .label('User email address'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number')
      .required('Password is required')
      .label('User password'),
    name: yup
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .required('Name is required')
      .label('User full name'),
    role: yup
      .string()
      .oneOf(Object.values(UserRole), 'Invalid role')
      .optional()
      .label('User role')
  });

  public static readonly loginSchema = yup.object({
    email: yup
      .string()
      .email('Please provide a valid email')
      .required('Email is required')
      .label('User email address'),
    password: yup
      .string()
      .required('Password is required')
      .label('User password')
  });

  public static readonly updateUserSchema = yup.object({
    email: yup
      .string()
      .email('Please provide a valid email')
      .optional()
      .label('User email address'),
    name: yup
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .optional()
      .label('User full name'),
    role: yup
      .string()
      .oneOf(Object.values(UserRole), 'Invalid role')
      .optional()
      .label('User role')
  });

  public static getAllSchemas() {
    return {
      RegisterInput: this.registerSchema, // Changed from RegisterRequest
      LoginInput: this.loginSchema,      // Changed from LoginRequest
      UpdateUserRequest: this.updateUserSchema
    };
  }
}