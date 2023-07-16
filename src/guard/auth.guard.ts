import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    NotFoundException 
  } from '@nestjs/common';
  import { Request } from 'express';
  import * as jwt from 'jsonwebtoken';
  import { Errormessage } from 'src/Errormessage';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new NotFoundException(Errormessage.InvalidToken)
      }
      try {
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
      } catch {
        throw new NotFoundException(Errormessage.InvalidToken)
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }