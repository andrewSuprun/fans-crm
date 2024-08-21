// src/modules/auth-module/guards/auth.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '../token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) return false;

    const isValid = await this.tokenService.isValidToken('ACCESS', token);
    if (!isValid) return false;

    const user = await this.tokenService.decodeToken('ACCESS', token);
    if (!user) return false;

    request.user = user;
    return true;
  }
}
