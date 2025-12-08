import { IsEnum, IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CmsPageType } from '../entities/cms-page.entity';

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

class MultilingualOptionalTextDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tr?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  en?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ar?: string;
}

export class CreateCmsPageDto {
  @ApiProperty({ enum: CmsPageType })
  @IsEnum(CmsPageType)
  type: CmsPageType;

  @ApiProperty({ type: MultilingualTextDto })
  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  title: MultilingualTextDto;

  @ApiProperty({ type: MultilingualTextDto })
  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  content: MultilingualTextDto;

  @ApiProperty({ type: MultilingualOptionalTextDto, required: false })
  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualOptionalTextDto)
  @IsOptional()
  metaTitle?: MultilingualOptionalTextDto;

  @ApiProperty({ type: MultilingualOptionalTextDto, required: false })
  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualOptionalTextDto)
  @IsOptional()
  metaDescription?: MultilingualOptionalTextDto;
}

