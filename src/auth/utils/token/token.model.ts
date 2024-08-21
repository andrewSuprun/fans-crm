// src/modules/auth-module/models/token.model.ts

import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Token extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  token: string;

  @Column({
    type: DataType.ENUM('ACCESS', 'REFRESH'),
    allowNull: false,
  })
  type: 'ACCESS' | 'REFRESH';

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt: Date;
}
