import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service'; // Import TokenService
import { Token } from './utils/token/token.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService, // Inject TokenService
    @InjectModel(Token)
    private tokenModel: typeof Token,
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
    const payload = { email: user.email, sub: user.id };

    const existingToken = await this.tokenService.isTokenPresent(user.id);
    console.log(existingToken, 'existingToken');

    if (!!existingToken) {
      const isTokenExpired = existingToken.expiresAt < new Date();

      if (isTokenExpired) {
        await existingToken.destroy();
        return {
          message: 'Token expired',
        };
      } else {
        // Update existing token with refresh token logic
        const refreshToken = await this.tokenService.generateToken(
          'ACCESS',
          payload,
        );
        await existingToken.destroy();
        await this.tokenModel.create({
          token: refreshToken,
          type: 'ACCESS',
          userId: user.id,
          expiresAt: new Date(
            Date.now() + parseInt(process.env.REFRESH_TOKEN_LIFE) * 1000,
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return {
          refresh_token: refreshToken,
        };
      }
    } else {
      // Create a new access token
      const accessToken = await this.tokenService.generateToken(
        'ACCESS',
        payload,
      );
      await this.tokenModel.destroy({
        where: { userId: user.id },
      });
      await this.tokenModel.create({
        token: accessToken,
        type: 'ACCESS',
        userId: user.id,
        expiresAt: new Date(
          Date.now() + parseInt(process.env.ACCESS_TOKEN_LIFE) * 1000,
        ),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        access_token: accessToken,
      };
    }
  }
}
