import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LeadSource } from '../entities/lead.entity';

export class CreateLeadDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty({ enum: LeadSource })
  @IsEnum(LeadSource)
  source: LeadSource;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  relatedListingId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  assignedAgentId?: string;
}

