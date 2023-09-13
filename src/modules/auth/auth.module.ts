import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IsExist } from 'src/shared/validators/is-exists.validator';
import { IsNotExist } from 'src/shared/validators/is-not-exists.validator';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    IsExist,
    IsNotExist,
  ],
  exports: [AuthService],
})
export class AuthModule {}
