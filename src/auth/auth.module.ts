import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule, // Додаємо ConfigModule
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // або configService.get('JWT_SECRET')
      signOptions: { expiresIn: '60m' },
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
