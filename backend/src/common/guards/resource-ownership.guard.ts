import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '../decorators/roles.decorator';

@Injectable()
export class ResourceOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resource = request.resource;

    // Admin has access to all resources
    if (user.role === Role.Admin) {
      return true;
    }

    // Agent can only access resources assigned to them
    if (user.role === Role.Agent) {
      if (resource && resource.assignedAgentId === user.id) {
        return true;
      }
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return false;
  }
}

