import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

// Define a type for the authenticated user to avoid 'any'
interface AuthenticatedUser {
    sub: string;
    role: string;
    refreshToken?: string;
}

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.auth.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.auth.login(dto);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    async refresh(@Req() req:{ user: AuthenticatedUser, body: { refreshToken: string }}) {
        const user = req.user; 
        // Validate saved refresh token and issue new tokens
        const ok = await this.auth.validateRefreshToken(user.sub, req.body.refreshToken);
        if (!ok) {
            throw new Error('Invalid refresh token');
        }
        const tokens = await this.auth.issueTokens(user.sub, user.role);
        await this.auth.updateRefreshToken(user.sub, tokens.refreshToken);
        return tokens;
    }
}