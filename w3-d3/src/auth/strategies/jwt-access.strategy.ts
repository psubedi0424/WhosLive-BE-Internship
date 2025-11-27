import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export interface JwtPayload {
    sub: string;
    role: string;
    iat?: number;
    exp?: number;
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET || 'access-secret',
        });
    }

    validate(payload: JwtPayload) {
        return {
            userId: payload.sub,
            role: payload.role
        };
    }
}
