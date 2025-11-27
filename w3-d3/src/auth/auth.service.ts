import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  private getAccessSecret() {
    return process.env.JWT_ACCESS_SECRET || 'access-secret';
  }

  private getRefreshSecret() {
    return process.env.JWT_REFRESH_SECRET || 'refresh-secret';
  }

  async register(dto: { email: string; password: string }) {
    const exists = await this.users.findByEmail(dto.email);
    if (exists) throw new BadRequestException('Email already in use');
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({ email: dto.email, password: hashed });
    const tokens = await this.issueTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
        return { user: { id: user.id, email: user.email, role: user.role }, tokens };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.issueTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { user: { id: user.id, email: user.email, role: user.role }, tokens };
  }
  async issueTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    const access = await this.jwt.signAsync(payload, {
      secret: this.getAccessSecret(),
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    });
    const refresh = await this.jwt.signAsync(payload, {
      secret: this.getRefreshSecret(),
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    });
    return { accessToken: access, refreshToken: refresh };
  }

  async updateRefreshToken(userId: string, token: string) {
    const hashed = await bcrypt.hash(token, 10);
    await this.users.update(userId, { refreshToken: hashed });
  }

  async validateRefreshToken(userId: string, token: string) {
    const user = await this.users.findById(userId);
    if (!user || !user.refreshToken) return false;
    const isMatch = await bcrypt.compare(token, user.refreshToken);
    return isMatch ? user : false;
  }
}
