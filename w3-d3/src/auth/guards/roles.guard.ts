import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Define a type for the authenticated user
interface AuthenticatedUser {
    role: string;
    [key: string]: any;
}

interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(ctx: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>('roles', ctx.getHandler());
        if (!requiredRoles) return true;

        const request:AuthenticatedRequest = ctx.switchToHttp().getRequest();
        const user = request.user;

        return user && requiredRoles.includes(user.role);
    }
}