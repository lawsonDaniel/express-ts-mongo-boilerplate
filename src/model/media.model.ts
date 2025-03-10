import {
    Model,
    Table,
    PrimaryKey,
    Column,
    DataType,
    AllowNull,
    ForeignKey,
    BelongsTo,
    Default,
  } from "sequelize-typescript";
  import { v4 as uuidv4 } from "uuid";
  import { UsersModel as User } from "./user.model";

  @Table({ timestamps: true, tableName: "media" })
  export class MediaModel extends Model {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id: string = uuidv4();
  
    @Column(DataType.TEXT)
    link!: string;
  
    @Column(DataType.STRING)
    mediaType!: string;
  
    @AllowNull(true)
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId?: string;
  
    @BelongsTo(() => User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    })
    user?: User;
  
}