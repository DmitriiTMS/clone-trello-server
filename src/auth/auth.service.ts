import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { verify } from 'argon2';
import { Response } from 'express';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  async register(dto: AuthDto) {
    const userEmail = await this.userService.getByEmail(dto.email);

    if (userEmail)
      throw new BadRequestException(
        `Пользователь с ${dto.email} уже есть в системе`,
      );

    const { password, ...user } = await this.userService.create(dto);

    const tokens = this.issueTokens(user.id, user.role);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: AuthDto) {
    const { password, ...user } = await this.validateUser(dto);

    const tokens = this.issueTokens(user.id, user.role);

    return {
      user,
      ...tokens,
    };
  }

  async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user)
      throw new NotFoundException(`Пользователя с ${dto.email} нет в системе`);

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword)
      throw new NotFoundException(`Введён не верный пароль`);

    return user;
  }

  private issueTokens(userId: string, userRole: string) {
    const data = {
      id: userId,
      role: userRole,
    };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh tiken');

    const { password, ...user } = await this.userService.getById(result.id);

    const tokens = this.issueTokens(user.id, user.role);

    return {
      user,
      ...tokens,
    };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: 'localhost',
      expires: expiresIn,
      secure: true,
      // prod 'lax'
      sameSite: 'none',
    });
  }

  removeRefreshToken(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: 'localhost',
      expires: new Date(0),
      secure: true,
      // prod 'lax'
      sameSite: 'none',
    });
  }
}
