import {
    Model,
    Table,
    PrimaryKey,
    Column,
    DataType,
    AllowNull,
    Default,
    Index,
    HasOne,
    HasMany,
  } from "sequelize-typescript";
  import { v4 as uuidv4 } from "uuid";

 
  import { MediaModel } from "./media.model"; // Adjust the import path as needed
  
  @Table({ timestamps: true, tableName: "users" })
  export class UsersModel extends Model {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id: string = uuidv4();
  
    @AllowNull(false)
    @Column(DataType.STRING)
    firstName!: string;
    
    @AllowNull(false)
    @Column(DataType.STRING)
    lastNme!: string;

    @AllowNull(false)
    @Column(DataType.DATE)
    dob!: Date;
    
    @AllowNull(true)
    @Column(DataType.STRING)
    pin!: string;

    // Add the HasMany association for MediaModel
    @HasMany(() => MediaModel, {
      foreignKey: "userId", // Reference to the user's id in the MediaModel
      as: "media", // Alias for the media association
    })
    media?: MediaModel[];
  
    @Index({ name: "combined-key-index1", unique: true })
    @AllowNull(false)
    @Column(DataType.STRING)
    email!: string;
  
    @Index({ name: "combined-key-index1", unique: true })
    @AllowNull(false)
    @Column(DataType.STRING)
    phone!: string;
  

    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string;
  
    @AllowNull(true)
    @Column(DataType.STRING)
    language!: string;
  
    @AllowNull(true)
    @Column(DataType.STRING)
    country!: string;
  
    //otp and mail verficaltion params
    @Default(false)
    @Column(DataType.BOOLEAN)
    verifiedMail?: boolean;
  
  
    @AllowNull(true)
    @Column(DataType.STRING)
    otpMail?: string;
  
    @Default(false)
    @Column(DataType.BOOLEAN)
    isOtpMailVerified?: boolean;
  
    @Default(Date.now) // Automatically set to the current timestamp
    @Column(DataType.DATE)
    otpMailCreatedAt?: Date; // Track when the OTP was generated
  
    @Default(false)
    @Column(DataType.BOOLEAN)
    isOtpMailExp?: boolean;
  
//phone verfication

@Default(false)
    @Column(DataType.BOOLEAN)
    verifiedPhone?: boolean;
  
  
    @AllowNull(true)
    @Column(DataType.STRING)
    otpPhone?: string;
  
    @Default(false)
    @Column(DataType.BOOLEAN)
    isOtpPhoneVerified?: boolean;
  
    @Default(Date.now) // Automatically set to the current timestamp
    @Column(DataType.DATE)
    otpPhoneCreatedAt?: Date; // Track when the OTP was generated
  
    @Default(false)
    @Column(DataType.BOOLEAN)
    isOtpPhoneExp?: boolean;
  

    @Default(false)
    @Column(DataType.BOOLEAN)
    isAdmin?: boolean;
  
  
    toJSON() {
      const values = { ...this.get() } as any;
      delete values.password;
      return values;
    }
  
    // Computed method to check if OTP is expired
    isOtpExpired(): boolean {
      if (!this.otpCreatedAt) {
        return true; // Consider it expired if there's no timestamp
      }
      const expirationTime = new Date(
        this.otpCreatedAt.getTime() + 30 * 60 * 1000,
      ); // 30 minutes in milliseconds
      return new Date() > expirationTime;
    }
  }