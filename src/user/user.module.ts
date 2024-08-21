import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user-model/user.model';
import { AuthModule } from 'src/auth/auth.module';
import { Token } from 'src/auth/utils/token/token.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Token]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
