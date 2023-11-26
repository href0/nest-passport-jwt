import { UnauthorizedException, ExecutionContext, Injectable, CanActivate, Request } from '@nestjs/common';
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../../../core/decorators/public.decorator';
@Injectable()
export class AuthGuard extends AuthGuardPassport('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
  handleRequest(err, user, info) {
  // You can throw an exception based on either "info" or "err" arguments
  if (err || !user) {
    throw err || new UnauthorizedException();
  }
  return user;
  }
}
