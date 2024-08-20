import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('add-user')
  @UseGuards(AuthGuard('jwt'))
  async addUser(
    @Body() userData: { name: string; email: string; phone: string },
  ) {
    const user = await this.userService.createUser(userData);
    console.log(user);
    return user;
  }

  @Get('get-user/:id')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }
}
