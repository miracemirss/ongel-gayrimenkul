import { IsString, IsEnum, IsUrl, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FooterLinkType } from '../entities/footer-link.entity';

export class CreateFooterLinkDto {
  @ApiProperty({ enum: FooterLinkType })
  @IsEnum(FooterLinkType)
  type: FooterLinkType;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsInt()
  @IsOptional()
  order?: number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

