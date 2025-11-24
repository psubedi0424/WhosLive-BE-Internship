import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { VersionDto } from './dto/version.dto';

@ApiTags('app')
@Controller()
export class AppController {
  @Get('health')
  @ApiOkResponse({ description: 'Health check OK' })
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('version')
  @ApiOkResponse({ type: VersionDto })
  version() {
    return {
      name: 'Intern API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'dev',
    };
  }
}
