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


// import { Controller, Get } from '@nestjs/common';
// import { BadRequestError, NotFoundError } from './common/errors/app.errors';

// @Controller()
// export class AppController {

//   @Get('ok')
//   ok() {
//     return { success: true, message: 'Hello from Day 4 NestJS!' };
//   }

//   @Get('fail')
//   fail() {
//     throw new BadRequestError('You triggered an intentional Day-4 failure.');
//   }

//   @Get('missing')
//   missing() {
//     throw new NotFoundError('This resource does not exist.');
//   }
// }