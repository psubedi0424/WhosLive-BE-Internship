import { ApiProperty } from '@nestjs/swagger';

export class VersionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  environment: string;
}
