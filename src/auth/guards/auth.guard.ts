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
    try {
      const request = context.switchToHttp().getRequest();
      const authorizationHeader = request.headers.authorization;

      if (!authorizationHeader) return false;

      const [scheme, token] = authorizationHeader.split(' ');

      if (scheme !== 'Bearer' || !token) return false;

      // Determine token type from route metadata or logic
      const tokenType =
        this.reflector.get<string>('tokenType', context.getHandler()) ||
        ('ACCESS' as any);
      const isValid = await this.tokenService.isValidToken(tokenType, token);
      if (!isValid) return false;

      const user = await this.tokenService.decodeToken(tokenType, token);
      if (!user) return false;

      request.user = user;
      return true;
    } catch (error) {
      console.log(error, 'error on canActivate');
      return false;
    }
  }
}
