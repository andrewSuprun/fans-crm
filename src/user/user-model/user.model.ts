// src/modules/user/models/user.model.ts

import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column
  phone: string;
}
