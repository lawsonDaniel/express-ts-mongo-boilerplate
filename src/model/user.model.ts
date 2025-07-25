import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, IUserCreate, UserRole } from '../types';

// Extend IUser to include Mongoose Document methods
export interface IUserDocument extends Omit<IUser, 'id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): Omit<IUser, 'password'>;
  isAdmin(): boolean;
}

// User Schema
const userSchema = new Schema<IUserDocument>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  versionKey: false
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Pre-save middleware to hash password
userSchema.pre<IUserDocument>('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if user is admin
userSchema.methods.isAdmin = function(): boolean {
  return this.role === UserRole.ADMIN;
};

// Override toJSON to exclude password
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static methods
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

// Create and export the model
export const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema);

// Repository class for database operations
export class UserRepository {
  public static async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).select('+password');
  }

  public static async findById(id: string): Promise<IUserDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return UserModel.findById(id);
  }

  public static async create(userData: IUserCreate): Promise<IUserDocument> {
    const user = new UserModel({
      email: userData.email.toLowerCase(),
      password: userData.password,
      name: userData.name,
      role: userData.role || UserRole.USER
    });
    
    return user.save();
  }

  public static async findAll(): Promise<IUserDocument[]> {
    return UserModel.find({}).sort({ createdAt: -1 });
  }

  public static async findActiveUsers(): Promise<IUserDocument[]> {
    return UserModel.find({ isActive: true }).sort({ createdAt: -1 });
  }

  public static async update(id: string, updateData: Partial<IUserCreate>): Promise<IUserDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const updateObj: any = {};
    if (updateData.email) updateObj.email = updateData.email.toLowerCase();
    if (updateData.name) updateObj.name = updateData.name;
    if (updateData.role) updateObj.role = updateData.role;

    return UserModel.findByIdAndUpdate(
      id, 
      updateObj, 
      { new: true, runValidators: true }
    );
  }

  public static async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  public static async softDelete(id: string): Promise<IUserDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return UserModel.findByIdAndUpdate(
      id, 
      { isActive: false }, 
      { new: true }
    );
  }

  public static async countUsers(): Promise<number> {
    return UserModel.countDocuments();
  }

  public static async countActiveUsers(): Promise<number> {
    return UserModel.countDocuments({ isActive: true });
  }

  public static async findUsersByRole(role: UserRole): Promise<IUserDocument[]> {
    return UserModel.find({ role, isActive: true });
  }

  // Pagination support
  public static async findWithPagination(
    page: number = 1, 
    limit: number = 10,
    filter: any = {}
  ): Promise<{
    users: IUserDocument[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      UserModel.countDocuments(filter)
    ]);

    return {
      users,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }
}