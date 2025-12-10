import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      this.logger.warn('RolesGuard: User not found in request');
      throw new ForbiddenException('Authentication required');
    }

    if (!user.role) {
      this.logger.warn(`RolesGuard: User ${user.id} has no role assigned`);
      throw new ForbiddenException('User role not assigned');
    }

    const hasRequiredRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRequiredRole) {
      this.logger.warn(
        `RolesGuard: User ${user.id} with role '${user.role}' does not have required roles: ${requiredRoles.join(', ')}`
      );
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. Your role: ${user.role}`
      );
    }

    return true;
  }
}

