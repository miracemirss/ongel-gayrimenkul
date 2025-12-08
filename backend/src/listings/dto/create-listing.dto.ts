import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsUUID,
  IsUrl,
  Min,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ListingStatus, Currency } from '../entities/listing.entity';

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

export class CreateListingDto {
  @ApiProperty({ type: MultilingualTextDto })
  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  title: MultilingualTextDto;

  @ApiProperty({ type: MultilingualTextDto })
  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  description: MultilingualTextDto;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ enum: Currency, default: Currency.TRY })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ enum: ListingStatus })
  @IsEnum(ListingStatus)
  status: ListingStatus;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  netArea: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  grossArea?: number;

  @ApiProperty()
  @IsString()
  roomCount: string;

  @ApiProperty({ required: false })
  @IsUrl({}, { message: 'virtualTourUrl must be a valid URL' })
  @IsOptional()
  virtualTourUrl?: string;

  @ApiProperty({ required: false })
  @IsUrl({}, { message: 'videoUrl must be a valid URL' })
  @IsOptional()
  videoUrl?: string;

  @ApiProperty()
  @IsUUID()
  assignedAgentId: string;
}

