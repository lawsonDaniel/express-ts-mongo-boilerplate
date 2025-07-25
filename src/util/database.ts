import mongoose from 'mongoose';

export class Database {
  private static instance: Database;
  private connectionString: string;

  private constructor() {
    this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_system';
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.connectionString);
      console.log('✅ Connected to MongoDB');
      
      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('📴 MongoDB connection closed through app termination');
        process.exit(0);
      });

    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.connection.close();
  }
}