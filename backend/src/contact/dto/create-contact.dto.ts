import { IsString, IsEmail, IsOptional, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ description: 'Full name of the contact' })
  @IsString()
  @MinLength(3, { message: 'Ad Soyad en az 3 karakter olmalıdır' })
  fullName: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  email: string;

  @ApiProperty({ description: 'Phone number (optional)', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  @MinLength(10, { message: 'Mesaj en az 10 karakter olmalıdır' })
  message: string;

  // Honeypot field for spam protection (should be empty)
  // This field is optional and should be ignored if present
  @IsOptional()
  website?: string; // Spam bots often fill this - validation skipped
}

