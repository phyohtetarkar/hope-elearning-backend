import { ROLES_KEY, STAFF_KEY } from '@/common/decorators';
import { UserDto, UserRole } from '@/core/models/user.dto';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const staffOnly = this.reflector.getAllAndOverride<UserRole[]>(STAFF_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    let roles: UserRole[] | undefined = undefined;

    if (staffOnly) {
      roles = staffOnly;
    }

    if (requiredRoles) {
      roles = requiredRoles;
    }

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const user: UserDto | undefined = request['user'];

    return roles.some((role) => user?.role === role);
  }
}
