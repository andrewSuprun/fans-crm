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
    const secret = process.env[`${type}_TOKEN_SECRET`];
    const expiresIn = process.env[`${type}_TOKEN_LIFE`];

    const token = this.jwtService.sign(data, {
      secret,
      expiresIn,
    });

    const expiresAt = new Date(Date.now() + parseInt(expiresIn) * 1000);

    await this.tokenModel.create({
      token,
      type,
      expiresAt,
    });

    return token;
  }

  async isValidToken(type: 'ACCESS' | 'REFRESH', token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env[`${type}_TOKEN_SECRET`],
      });
      return !!decoded;
    } catch (error) {
      console.log('Token validation failed:', error);
      return false;
    }
  }

  async isTokenPresent(type: 'ACCESS' | 'REFRESH', token: string) {
    const record = await this.tokenModel.findOne({
      where: { token, type },
    });
    return !!record;
  }

  async decodeToken(type: 'ACCESS' | 'REFRESH', token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env[`${type}_TOKEN_SECRET`],
      });
      return decoded;
    } catch (error) {
      console.log('Token decoding failed:', error);
      return null;
    }
  }
}
