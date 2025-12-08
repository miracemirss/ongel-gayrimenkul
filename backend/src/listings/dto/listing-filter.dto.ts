import { IsEnum, IsOptional, IsString, IsNumber, Min, Max, MaxLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ListingStatus, Currency } from '../entities/listing.entity';

export enum SortBy {
  Price = 'price',
  CreatedAt = 'createdAt',
  NetArea = 'netArea',
  Location = 'location',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class ListingFilterDto {
  @ApiPropertyOptional({ enum: ListingStatus })
  @IsEnum(ListingStatus)
  @IsOptional()
  status?: ListingStatus;

  @ApiPropertyOptional({ enum: Currency })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  minArea?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  maxArea?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Matches(/^[\d+\-\s]+$/, { message: 'Room count must contain only numbers, +, -, and spaces' })
  roomCount?: string;

  // Pagination
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12, minimum: 1, maximum: 100 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 12;

  // Sorting
  @ApiPropertyOptional({ enum: SortBy, default: SortBy.CreatedAt })
  @IsEnum(SortBy)
  @IsOptional()
  sortBy?: SortBy = SortBy.CreatedAt;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC;
}

