import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { IRequest } from 'src/shared/interfaces';
import { Roles } from 'src/shared/decorators';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRoleEnum } from 'src/shared/enums';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthTokenGuard)
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @Get('/me')
  getCurrentUser(@Request() request: IRequest) {
    return this.userService.findById(request.user.uid);
  }
}
