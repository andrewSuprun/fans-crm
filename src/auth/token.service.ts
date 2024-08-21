// src/modules/auth-module/token.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { Token } from './utils/token/token.model';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token) private tokenModel: typeof Token,
    private jwtService: JwtService,
  ) {}

  async generateToken(type: 'ACCESS' | 'REFRESH', data: any) {
    try {
      const secret = process.env[`${type}_TOKEN_SECRET`];
      const expiresIn = process.env[`${type}_TOKEN_LIFE`];
      const expiresInValue = Number(expiresIn) ? Number(expiresIn) : expiresIn;
      const token = this.jwtService.sign(data, {
        algorithm: 'HS256',
        secret,
        expiresIn: expiresInValue,
      });

      return token;
    } catch (error) {
      console.log('error generating token', error);
    }
  }

  async isValidToken(type: 'ACCESS' | 'REFRESH', token: string) {
    try {
      const secret = process.env[`${type}_TOKEN_SECRET`];
      const decoded = this.jwtService.verify(token, {
        secret,
      });
      return !!decoded;
    } catch (error) {
      console.log('Token validation failed:', error);
      return false;
    }
  }

  async isTokenPresent(userId: string) {
    const record = await this.tokenModel.findOne({
      where: { userId },
    });
    return record;
  }

  async decodeToken(type: 'ACCESS' | 'REFRESH', token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        algorithms: ['HS256'],
        secret: process.env[`${type}_TOKEN_SECRET`],
      });
      return decoded;
    } catch (error) {
      console.log('Token decoding failed:', error);
      return null;
    }
  }
  async invalidateTokens(userId: number) {
    // Remove all tokens for the user
    await this.tokenModel.destroy({
      where: { userId },
    });
  }
}
