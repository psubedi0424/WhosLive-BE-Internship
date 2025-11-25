import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateCreatorDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  platform?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;
}
 