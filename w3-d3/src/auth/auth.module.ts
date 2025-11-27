import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { DataSource } from 'typeorm';
import {UsersModule}  from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
// import { RolesGuard } from './guards/roles.guard';
// import { APP_GUARD } from '@nestjs/core';
import { AdminController } from '../admin/admin.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}), // we'll sign manually with secrets
  ],
  controllers: [AuthController,AdminController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    // optional: make RolesGuard global or use per-route
    // { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
