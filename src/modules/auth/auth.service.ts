import { AuthEmailLoginDto } from './dtos/login.dto';
import { AuthRegisterLoginDto } from './dtos/register.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILoginResponse } from './interfaces/login-response.interface';
import { JwtService } from '@nestjs/jwt';
import { UserRoleEnum } from 'src/shared/enums';
import { UsersService } from 'src/modules/users/user.service';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<ILoginResponse> {
    const user = await this.usersService.findOne({
      email: loginDto.email,
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    if (!isValidPassword) {
      throw new BadRequestException('Password is incorrect');
    }

    const tokens = await this.getTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    const hash = await bcrypt.hash(dto.password, 10);
    const newUser = await this.usersService.create({
      ...dto,
      password: hash,
    });

    const tokens = await this.getTokens(newUser.id, newUser.role);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
  }

  async logout(userId: number) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      user.refreshToken,
      refreshToken
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: number, role: UserRoleEnum) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          uid: userId,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '7d',
        }
      ),
      this.jwtService.signAsync(
        {
          uid: userId,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
