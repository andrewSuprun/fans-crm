import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('api/v1')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }
  @Post('sign-up')
  async addUser(
    @Body()
    userData: {
      email: string;
      password: string;
      name: string;
      phone: string;
    },
  ) {
    const user = await this.userService.createUser(userData);
    // Generate token for the newly created user
    const token = await this.authService.login(user);

    return { user, token: token.access_token }; // Return the token
  }

  @UseGuards(AuthGuard)
  @Get('get-me')
  async getUser(@Req() request: Request & { user: any }) {
    return this.userService.findByEmail(request.user.email);
  }
}
