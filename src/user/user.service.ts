import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user-model/user.model';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async getUserById(id: number): Promise<User> {
    return this.userModel.findByPk(id);
  }
  async createUser({
    email,
    password,
    phone,
    name,
  }: {
    email: string;
    password: string;
    phone: string;
    name: string;
  }): Promise<User> {
    console.log(password, 'password');
    const hashedPassword = await this.hashPassword(password);
    console.log(hashedPassword, 'hashedPassword');
    return this.userModel.create({
      email,
      password: hashedPassword,
      name,
      phone,
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ where: { email } });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = 10;
    return bcrypt.hash(password, salt);
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
