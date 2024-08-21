import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginDto } from './login.dto';
import { AuthGuard } from './guards/auth.guard';
import { TokenService } from './token.service';
import { TokenType } from './decorator/auth-type.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly tokenService: TokenService,
  ) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      token:
        (await this.authService.login(user.dataValues))?.access_token ||
        (await this.authService.login(user.dataValues))?.refresh_token,
      user: user.dataValues,
    };
  }
  @UseGuards(AuthGuard)
  @Post('logout')
  @TokenType('REFRESH')
  @HttpCode(204) // No Content
  async logout(@Req() request: Request & { user: any }) {
    const userId = request.user.sub;

    await this.tokenService.invalidateTokens(userId);
  }
}
