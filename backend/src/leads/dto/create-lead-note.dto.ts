import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadNoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}

