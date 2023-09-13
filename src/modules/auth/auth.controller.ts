import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ILoginResponse } from './interfaces/login-response.interface';
import { Roles } from 'src/shared/decorators';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRoleEnum } from 'src/shared/enums';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: AuthEmailLoginDto): Promise<ILoginResponse> {
    return this.service.validateLogin(loginDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: AuthRegisterLoginDto): Promise<void> {
    return this.service.register(createUserDto);
  }

  @ApiBearerAuth()
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refresh(@Request() request): Promise<ILoginResponse> {
    const userId = request.user.sub;
    const { refreshToken } = request.user;
    return this.service.refreshTokens(userId, refreshToken);
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Request() request): Promise<void> {
    this.service.logout(request.user.sub);
  }
}
