import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/user-model/user.model';
import { Token } from './utils/token/token.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokenService } from './token.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Token]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // Add a default secret for development/testing
      signOptions: { expiresIn: '60m' },
    }),
    forwardRef(() => UserModule), // Use forwardRef to handle circular dependencies
  ],
  providers: [AuthService, TokenService],
  controllers: [AuthController],
  exports: [AuthService, TokenService], // Make AuthService available for other modules
})
export class AuthModule { }
