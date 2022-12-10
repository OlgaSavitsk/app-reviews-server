import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/core/decorators/roles.decorator';
import * as dotenv from 'dotenv';
import { Role } from 'src/roles/entity/role.enum';
import { UserEntity } from 'src/users/entity/user.entity';

dotenv.config();

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const { user }: { user: UserEntity } = context.switchToHttp().getRequest();
    return roles.some((role) => user.roles.includes(role));
  }
}
