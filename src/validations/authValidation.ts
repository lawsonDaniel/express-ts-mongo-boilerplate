import * as yup from 'yup';
import { UserRole } from '../types';

export class AuthValidation {
  public static readonly registerSchema = yup.object({
    email: yup
      .string()
      .email('Please provide a valid email')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number')
      .required('Password is required'),
    name: yup
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .required('Name is required'),
    role: yup
      .string()
      .oneOf(Object.values(UserRole), 'Invalid role')
      .optional()
  });

  public static readonly loginSchema = yup.object({
    email: yup
      .string()
      .email('Please provide a valid email')
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
  });

  public static readonly updateUserSchema = yup.object({
    email: yup
      .string()
      .email('Please provide a valid email')
      .optional(),
    name: yup
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .optional(),
    role: yup
      .string()
      .oneOf(Object.values(UserRole), 'Invalid role')
      .optional()
  });
}