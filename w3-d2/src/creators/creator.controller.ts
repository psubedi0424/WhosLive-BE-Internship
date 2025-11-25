import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreateCreatorDto } from './creator.dto';

@Controller('creators')
export class CreatorController {
  constructor(private service: CreatorService) {}

  @Post()
  create(@Body() dto: CreateCreatorDto) {
    return this.service.create(dto);
  }

  @Get()
  list(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.service.findAll(page, limit);
  }

  @Get('cursor')
  listByCursor(
    @Query('cursor') cursor?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.service.listByCursor(cursor, limit);
  }
}
