import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  public canActivate(context: ExecutionContext): boolean {
    // console.log("this is guard");
    // Public()이 클래스전체나 개별라우터에 있을 경우 auth 건너 뜀
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    // console.log(context.getHandler())
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    if (!req.userId) throw new HttpException('권한이 없습니다', 401);

    return true
  }
}
