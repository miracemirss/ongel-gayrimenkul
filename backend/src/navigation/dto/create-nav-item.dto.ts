import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { NavItemType } from '../entities/nav-item.entity';

class MultilingualTextDto {
  @ApiProperty()
  @IsString()
  tr: string;

  @ApiProperty()
  @IsString()
  en: string;

  @ApiProperty()
  @IsString()
  ar: string;
}

export class CreateNavItemDto {
  @ApiProperty()
  label: MultilingualTextDto;

  @ApiProperty()
  @IsString()
  href: string;

  @ApiProperty({ enum: NavItemType, default: NavItemType.Link })
  @IsEnum(NavItemType)
  @IsOptional()
  type?: NavItemType;

  @ApiProperty({ required: false, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  parentId?: string;
}

