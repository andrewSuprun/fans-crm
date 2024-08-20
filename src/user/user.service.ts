import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user-model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  async createUser(data: {
    name: string;
    email: string;
    phone: string;
  }): Promise<User> {
    return this.userModel.create(data);
  }

  async getUserById(id: number): Promise<User> {
    return this.userModel.findByPk(id);
  }
}
