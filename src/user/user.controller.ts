import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
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
    console.log(userData, 'userData');
    const user = await this.userService.createUser(userData);
    console.log(user);

    // Generate token for the newly created user
    const token = await this.authService.login(user);
    

    return { user, token: token.access_token }; // Return the token
  }

  @UseGuards(AuthGuard)
  @Get('get-me')
  async getUser(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
}
