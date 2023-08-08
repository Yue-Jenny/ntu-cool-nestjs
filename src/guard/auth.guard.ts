import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * see: https://docs.nestjs.com/security/authentication
 * and see: https://docs.nestjs.com/guards
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly ALLOWED_TOKEN = 'cool';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // 若沒有 token 或 token 不是 cool 則回傳 UnauthorizedException
    if (!token || token !== this.ALLOWED_TOKEN) {
      throw new UnauthorizedException('Invalid or missing token.');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (request.headers['authorization']) {
      const [type, token] = request.headers['authorization'].split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
    return undefined;
  }
}
