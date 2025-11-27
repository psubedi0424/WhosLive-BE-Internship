import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';

@Controller('admin')
export class AdminController {
    @Get('secret')
    @UseGuards(JwtAccessGuard, RolesGuard)
    @Roles('admin')
    secret() {
        return { ok: true, secret: 'only admins' };
    }
}
