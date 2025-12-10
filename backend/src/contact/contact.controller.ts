import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit contact form (Public)' })
  @ApiResponse({ status: 200, description: 'Contact form submitted successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async submitContactForm(@Body() createContactDto: CreateContactDto) {
    return this.contactService.submitContactForm(createContactDto);
  }
}

