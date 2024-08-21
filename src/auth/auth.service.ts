import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Token } from './utils/token/token.model';
import { InjectModel } from '@nestjs/sequelize';
// Import Token model

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(Token)
    private tokenModel: typeof Token, // Inject Token model
  ) { }

  async validateUser(email: string, plainPassword: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (
      user &&
      (await this.userService.validatePassword(plainPassword, user.password))
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    try {
      const payload = { email: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payload);
      const expiresIn = +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN; // E.g., '3600' for 1 hour
      const expiresAt = new Date(Date.now() + expiresIn * 1000);

      // Save the token to the database
      await this.tokenModel.create({
        token: accessToken,
        type: 'ACCESS',
        userId: user.id,
        expiresAt: expiresAt,
      });

      return {
        access_token: accessToken,
      };
    } catch (error) {
      console.log(error, 'error at login');
     }
  }
}
