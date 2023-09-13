import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../enums';

export const Roles = (...roles: UserRoleEnum[]) => SetMetadata('roles', roles);
