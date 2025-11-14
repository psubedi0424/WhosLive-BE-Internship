import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('ok')
  ok() {
    return { success: true, message: 'Http working fine!' };
  }
  @Get('fail')
  fail() {
    throw new Error('Intentational failure for testing purpose');
  }
  @Get('missing')
  missing() {
    return { success: false, message: 'Not found!' };
  }
}
