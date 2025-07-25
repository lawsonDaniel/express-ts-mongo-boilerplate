export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}

export interface IJwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}