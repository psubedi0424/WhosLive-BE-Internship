import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
export interface JwtPayload {
    sub: string;
    role: string;
    iat?: number;
    exp?: number;
}
export interface RefreshUser {
    sub: string;
    role: string;
}


@Injectable()
class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor() {
        super({
            jwtFromRequest: (req: Request & { body: { refreshToken?: string } }): string | null => {
                return req.body?.refreshToken ?? null;
            },
            secretOrKey: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
            passReqToCallback: true,
        });
    }


    validate(req: Request, payload: JwtPayload):RefreshUser {
        // payload contains sub and role
        // return the payload so controller can access it as req.user
        return { sub: payload.sub, role: payload.role };
    }
}
export { JwtRefreshStrategy }