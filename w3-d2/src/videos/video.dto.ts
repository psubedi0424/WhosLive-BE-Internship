import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsUUID } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  creatorId: string;

  @IsUUID('4', { each: true })
  @IsOptional()
  categoryIds?: string[];

  @IsBoolean()
  @IsOptional()
  isLive?: boolean;

  @IsNumber()
  @IsOptional()
  viewerCount?: number;
}
